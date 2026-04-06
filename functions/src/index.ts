import { onCall, onRequest, HttpsError } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import * as admin from "firebase-admin";
import * as crypto from "crypto";
import axios from "axios";

admin.initializeApp();

const FLOW_API_KEY    = defineSecret("FLOW_API_KEY");
const FLOW_SECRET_KEY = defineSecret("FLOW_SECRET_KEY");

const FLOW_SANDBOX = "https://sandbox.flow.cl/api";
const FLOW_PROD    = "https://www.flow.cl/api";

function getFlowUrl() {
  return process.env.FLOW_ENV === "production" ? FLOW_PROD : FLOW_SANDBOX;
}

// Firma los parámetros según el algoritmo de Flow (HMAC-SHA256)
function signParams(params: Record<string, string>, secretKey: string): string {
  const toSign = Object.keys(params)
    .sort()
    .map((k) => k + params[k])
    .join("");
  return crypto.createHmac("sha256", secretKey).update(toSign).digest("hex");
}

// ── 1. Crear orden de pago en Flow ────────────────────────────────────────────
export const createFlowPayment = onCall(
  { secrets: [FLOW_API_KEY, FLOW_SECRET_KEY], region: "us-central1" },
  async (request) => {
    const { planId, planNombre, amount, email, nombre } = request.data as {
      planId: string;
      planNombre: string;
      amount: number;
      email: string;
      nombre?: string;
    };

    if (!email || !planId || !amount) {
      throw new HttpsError(
        "invalid-argument",
        "Faltan parámetros requeridos: planId, amount, email"
      );
    }

    const apiKey    = FLOW_API_KEY.value();
    const secretKey = FLOW_SECRET_KEY.value();

    // Crear documento en Firestore para rastrear el pago
    const orderRef      = admin.firestore().collection("pagos").doc();
    const commerceOrder = orderRef.id;

    await orderRef.set({
      planId,
      planNombre,
      amount,
      email,
      nombre: nombre ?? "",
      status: "pending",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const confirmationUrl =
      "https://us-central1-proyecto-kodafix.cloudfunctions.net/flowConfirmation";
    const returnUrl =
      `${process.env.FRONTEND_URL ?? "https://proyecto-kodafix.web.app"}/pago/resultado`;

    const params: Record<string, string> = {
      apiKey,
      subject:         `Koda Fix · Plan ${planNombre}`,
      currency:        "CLP",
      amount:          String(amount),
      email,
      urlConfirmation: confirmationUrl,
      urlReturn:       returnUrl,
      commerceOrder,
      paymentMethod:   "9",
    };

    if (nombre) params.name = nombre;

    params.s = signParams(params, secretKey);

    try {
      const response = await axios.post(
        `${getFlowUrl()}/payment/create`,
        new URLSearchParams(params).toString(),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      const { url, token } = response.data as { url: string; token: string };

      await orderRef.update({ flowToken: token });

      return { paymentUrl: `${url}?token=${token}`, orderId: commerceOrder };
    } catch (err: unknown) {
      const e = err as { response?: { data: unknown; status: number }; message: string };
      const flowError = e.response?.data ?? e.message;
      console.error("Flow create error:", JSON.stringify(flowError));
      throw new HttpsError("internal", "Error al crear la orden de pago en Flow", flowError);
    }
  }
);

// ── 2. Webhook de confirmación (Flow llama a esta URL en background) ──────────
//    invoker: "public" → permite acceso sin autenticación (necesario para Flow)
export const flowConfirmation = onRequest(
  { secrets: [FLOW_API_KEY, FLOW_SECRET_KEY], region: "us-central1", invoker: "public" },
  async (req, res) => {
    const token =
      (req.body as Record<string, string>)?.token ??
      (req.query.token as string);

    if (!token) {
      res.status(400).send("Missing token");
      return;
    }

    const apiKey    = FLOW_API_KEY.value();
    const secretKey = FLOW_SECRET_KEY.value();

    const params: Record<string, string> = { apiKey, token };
    params.s = signParams(params, secretKey);

    try {
      const response = await axios.get(`${getFlowUrl()}/payment/getStatus`, { params });

      const { commerceOrder, status } = response.data as {
        commerceOrder: string;
        status: number;
      };

      const statusMap: Record<number, string> = {
        1: "pending", 2: "paid", 3: "rejected", 4: "cancelled",
      };

      if (commerceOrder) {
        await admin.firestore()
          .collection("pagos")
          .doc(commerceOrder)
          .update({
            status:      statusMap[status] ?? "unknown",
            flowStatus:  status,
            flowData:    response.data,
            confirmedAt: admin.firestore.FieldValue.serverTimestamp(),
          });
      }

      res.send("OK");
    } catch (err: unknown) {
      const e = err as { response?: { data: unknown }; message: string };
      console.error("Flow confirmation error:", e.response?.data ?? e.message);
      res.status(500).send("Error");
    }
  }
);

// ── 3. Verificar estado del pago (frontend) + actualiza Firestore ─────────────
export const checkPaymentStatus = onCall(
  { secrets: [FLOW_API_KEY, FLOW_SECRET_KEY], region: "us-central1" },
  async (request) => {
    const { token } = request.data as { token: string };

    if (!token) {
      throw new HttpsError("invalid-argument", "Token requerido");
    }

    const apiKey    = FLOW_API_KEY.value();
    const secretKey = FLOW_SECRET_KEY.value();

    const params: Record<string, string> = { apiKey, token };
    params.s = signParams(params, secretKey);

    try {
      const response = await axios.get(`${getFlowUrl()}/payment/getStatus`, { params });

      const data = response.data as {
        commerceOrder: string;
        status: number;
        amount: number;
        subject: string;
        flowOrder: number;
        payer: string;
      };

      // Actualiza Firestore directamente desde el frontend (sin depender del webhook)
      const statusMap: Record<number, string> = {
        1: "pending", 2: "paid", 3: "rejected", 4: "cancelled",
      };

      if (data.commerceOrder) {
        await admin.firestore()
          .collection("pagos")
          .doc(data.commerceOrder)
          .update({
            status:      statusMap[data.status] ?? "unknown",
            flowStatus:  data.status,
            flowData:    data,
            confirmedAt: admin.firestore.FieldValue.serverTimestamp(),
          });
      }

      return data;
    } catch (err: unknown) {
      const e = err as { response?: { data: unknown }; message: string };
      console.error("Flow status error:", e.response?.data ?? e.message);
      throw new HttpsError("internal", "Error al verificar el estado del pago");
    }
  }
);
