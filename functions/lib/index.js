"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPaymentStatus = exports.flowConfirmation = exports.createFlowPayment = void 0;
const https_1 = require("firebase-functions/v2/https");
const params_1 = require("firebase-functions/params");
const admin = __importStar(require("firebase-admin"));
const crypto = __importStar(require("crypto"));
const axios_1 = __importDefault(require("axios"));
admin.initializeApp();
const FLOW_API_KEY = (0, params_1.defineSecret)("FLOW_API_KEY");
const FLOW_SECRET_KEY = (0, params_1.defineSecret)("FLOW_SECRET_KEY");
const FLOW_SANDBOX = "https://sandbox.flow.cl/api";
const FLOW_PROD = "https://www.flow.cl/api";
function getFlowUrl() {
    return process.env.FLOW_ENV === "production" ? FLOW_PROD : FLOW_SANDBOX;
}
// Firma los parámetros según el algoritmo de Flow (HMAC-SHA256)
function signParams(params, secretKey) {
    const toSign = Object.keys(params)
        .sort()
        .map((k) => k + params[k])
        .join("");
    return crypto.createHmac("sha256", secretKey).update(toSign).digest("hex");
}
// ── 1. Crear orden de pago en Flow ────────────────────────────────────────────
exports.createFlowPayment = (0, https_1.onCall)({ secrets: [FLOW_API_KEY, FLOW_SECRET_KEY], region: "us-central1" }, async (request) => {
    var _a, _b, _c;
    const { planId, planNombre, amount, email, nombre } = request.data;
    if (!email || !planId || !amount) {
        throw new https_1.HttpsError("invalid-argument", "Faltan parámetros requeridos: planId, amount, email");
    }
    const apiKey = FLOW_API_KEY.value();
    const secretKey = FLOW_SECRET_KEY.value();
    // Crear documento en Firestore para rastrear el pago
    const orderRef = admin.firestore().collection("pagos").doc();
    const commerceOrder = orderRef.id;
    await orderRef.set({
        planId,
        planNombre,
        amount,
        email,
        nombre: nombre !== null && nombre !== void 0 ? nombre : "",
        status: "pending",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    const confirmationUrl = "https://us-central1-proyecto-kodafix.cloudfunctions.net/flowConfirmation";
    const returnUrl = `${(_a = process.env.FRONTEND_URL) !== null && _a !== void 0 ? _a : "https://proyecto-kodafix.web.app"}/pago/resultado`;
    const params = {
        apiKey,
        subject: `Koda Fix · Plan ${planNombre}`,
        currency: "CLP",
        amount: String(amount),
        email,
        urlConfirmation: confirmationUrl,
        urlReturn: returnUrl,
        commerceOrder,
        paymentMethod: "9",
    };
    if (nombre)
        params.name = nombre;
    params.s = signParams(params, secretKey);
    try {
        const response = await axios_1.default.post(`${getFlowUrl()}/payment/create`, new URLSearchParams(params).toString(), { headers: { "Content-Type": "application/x-www-form-urlencoded" } });
        const { url, token } = response.data;
        await orderRef.update({ flowToken: token });
        return { paymentUrl: `${url}?token=${token}`, orderId: commerceOrder };
    }
    catch (err) {
        const e = err;
        const flowError = (_c = (_b = e.response) === null || _b === void 0 ? void 0 : _b.data) !== null && _c !== void 0 ? _c : e.message;
        console.error("Flow create error:", JSON.stringify(flowError));
        throw new https_1.HttpsError("internal", "Error al crear la orden de pago en Flow", flowError);
    }
});
// ── 2. Webhook de confirmación (Flow llama a esta URL en background) ──────────
//    invoker: "public" → permite acceso sin autenticación (necesario para Flow)
exports.flowConfirmation = (0, https_1.onRequest)({ secrets: [FLOW_API_KEY, FLOW_SECRET_KEY], region: "us-central1", invoker: "public" }, async (req, res) => {
    var _a, _b, _c, _d, _e;
    const token = (_b = (_a = req.body) === null || _a === void 0 ? void 0 : _a.token) !== null && _b !== void 0 ? _b : req.query.token;
    if (!token) {
        res.status(400).send("Missing token");
        return;
    }
    const apiKey = FLOW_API_KEY.value();
    const secretKey = FLOW_SECRET_KEY.value();
    const params = { apiKey, token };
    params.s = signParams(params, secretKey);
    try {
        const response = await axios_1.default.get(`${getFlowUrl()}/payment/getStatus`, { params });
        const { commerceOrder, status } = response.data;
        const statusMap = {
            1: "pending", 2: "paid", 3: "rejected", 4: "cancelled",
        };
        if (commerceOrder) {
            await admin.firestore()
                .collection("pagos")
                .doc(commerceOrder)
                .update({
                status: (_c = statusMap[status]) !== null && _c !== void 0 ? _c : "unknown",
                flowStatus: status,
                flowData: response.data,
                confirmedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
        }
        res.send("OK");
    }
    catch (err) {
        const e = err;
        console.error("Flow confirmation error:", (_e = (_d = e.response) === null || _d === void 0 ? void 0 : _d.data) !== null && _e !== void 0 ? _e : e.message);
        res.status(500).send("Error");
    }
});
// ── 3. Verificar estado del pago (frontend) + actualiza Firestore ─────────────
exports.checkPaymentStatus = (0, https_1.onCall)({ secrets: [FLOW_API_KEY, FLOW_SECRET_KEY], region: "us-central1" }, async (request) => {
    var _a, _b, _c;
    const { token } = request.data;
    if (!token) {
        throw new https_1.HttpsError("invalid-argument", "Token requerido");
    }
    const apiKey = FLOW_API_KEY.value();
    const secretKey = FLOW_SECRET_KEY.value();
    const params = { apiKey, token };
    params.s = signParams(params, secretKey);
    try {
        const response = await axios_1.default.get(`${getFlowUrl()}/payment/getStatus`, { params });
        const data = response.data;
        // Actualiza Firestore directamente desde el frontend (sin depender del webhook)
        const statusMap = {
            1: "pending", 2: "paid", 3: "rejected", 4: "cancelled",
        };
        if (data.commerceOrder) {
            await admin.firestore()
                .collection("pagos")
                .doc(data.commerceOrder)
                .update({
                status: (_a = statusMap[data.status]) !== null && _a !== void 0 ? _a : "unknown",
                flowStatus: data.status,
                flowData: data,
                confirmedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
        }
        return data;
    }
    catch (err) {
        const e = err;
        console.error("Flow status error:", (_c = (_b = e.response) === null || _b === void 0 ? void 0 : _b.data) !== null && _c !== void 0 ? _c : e.message);
        throw new https_1.HttpsError("internal", "Error al verificar el estado del pago");
    }
});
//# sourceMappingURL=index.js.map