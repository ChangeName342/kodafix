import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { httpsCallable } from "firebase/functions";
import { signInAnonymously } from "firebase/auth";
import { functions, auth } from "../firebase/config";
import { useTheme } from "../context/ThemeContext";

interface FlowPaymentData {
  status: number;          // 1=pendiente 2=pagado 3=rechazado 4=anulado
  amount: number;
  subject: string;
  commerceOrder: string;
  flowOrder: number;
  payer: string;
}

type PageState = "loading" | "paid" | "pending" | "rejected" | "error";

export default function PagoResultado() {
  const [searchParams] = useSearchParams();
  const navigate       = useNavigate();
  const token          = searchParams.get("token");
  const { c } = useTheme();
  const BG      = c.bg;
  const TEXT_HI  = c.textHi;
  const TEXT_MID = c.textMid;
  const TEXT_LOW = c.textLow;

  const [state,   setState]   = useState<PageState>("loading");
  const [data,    setData]    = useState<FlowPaymentData | null>(null);
  const [errMsg,  setErrMsg]  = useState("");

  useEffect(() => {
    if (!token) {
      setState("error");
      setErrMsg("No se recibió el token de pago.");
      return;
    }

    const checkPaymentStatus = httpsCallable<{ token: string }, FlowPaymentData>(
      functions,
      "checkPaymentStatus"
    );

    const run = async () => {
      if (!auth.currentUser) await signInAnonymously(auth);
      return checkPaymentStatus({ token });
    };

    run()
      .then((result) => {
        setData(result.data);
        const statusMap: Record<number, PageState> = {
          1: "pending",
          2: "paid",
          3: "rejected",
          4: "rejected",
        };
        setState(statusMap[result.data.status] ?? "error");
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : "Error al verificar el pago.";
        setErrMsg(msg);
        setState("error");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div style={{ background: BG, minHeight: "100vh", fontFamily: "'Outfit',sans-serif", display: "flex", flexDirection: "column", transition: "background 0.3s" }}>

      {/* Header */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "18px 32px" }}>
        <span style={{ color: TEXT_MID, fontSize: 13, fontFamily: "'Outfit',sans-serif" }}>
          Koda Fix · Resultado del pago
        </span>
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ maxWidth: 460, width: "100%", textAlign: "center" }}>

          {/* Loading */}
          {state === "loading" && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
              <div style={{
                width: 64, height: 64, borderRadius: 16,
                background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" style={{ animation: "spin 0.8s linear infinite" }}>
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
              </div>
              <div>
                <p style={{ color: TEXT_HI, fontWeight: 700, fontSize: 18, margin: "0 0 8px" }}>Verificando tu pago…</p>
                <p style={{ color: TEXT_MID, fontSize: 14, margin: 0 }}>Esto solo toma un momento.</p>
              </div>
            </div>
          )}

          {/* Pagado */}
          {state === "paid" && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
              <div style={{
                width: 72, height: 72, borderRadius: 20,
                background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>

              <div>
                <h1 style={{ color: TEXT_HI, fontWeight: 800, fontSize: 26, margin: "0 0 10px", letterSpacing: -0.8 }}>
                  ¡Pago confirmado!
                </h1>
                <p style={{ color: TEXT_MID, fontSize: 15, margin: "0 0 24px", lineHeight: 1.6 }}>
                  Tu contratación fue procesada exitosamente.<br />
                  Recibirás un correo de confirmación pronto.
                </p>
              </div>

              {data && (
                <div style={{
                  background: "#0d0d1a", border: "1px solid rgba(34,197,94,0.2)",
                  borderRadius: 14, padding: "20px 24px", width: "100%", textAlign: "left",
                }}>
                  {[
                    ["Orden Flow",   String(data.flowOrder)],
                    ["Referencia",   data.commerceOrder],
                    ["Servicio",     data.subject],
                    ["Email",        data.payer],
                  ].map(([label, value]) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: TEXT_LOW, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</span>
                      <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: TEXT_MID }}>{value}</span>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={() => navigate("/")}
                style={{
                  background: "linear-gradient(135deg,#16a34a,#22c55e)", border: "none",
                  borderRadius: 11, padding: "13px 32px",
                  fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 700,
                  color: "#fff", cursor: "pointer",
                  boxShadow: "0 8px 24px rgba(34,197,94,0.25)",
                }}
              >
                Volver al inicio
              </button>
            </div>
          )}

          {/* Pendiente */}
          {state === "pending" && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
              <div style={{
                width: 72, height: 72, borderRadius: 20,
                background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div>
                <h1 style={{ color: TEXT_HI, fontWeight: 800, fontSize: 24, margin: "0 0 10px", letterSpacing: -0.8 }}>
                  Pago en proceso
                </h1>
                <p style={{ color: TEXT_MID, fontSize: 14, margin: "0 0 24px", lineHeight: 1.6 }}>
                  Tu pago está siendo procesado por Flow.<br />
                  Recibirás un correo cuando se confirme.
                </p>
              </div>
              <button onClick={() => navigate("/")} style={{ background: "transparent", border: "1px solid rgba(251,191,36,0.3)", color: "#fbbf24", borderRadius: 11, padding: "12px 28px", cursor: "pointer", fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 600 }}>
                Volver al inicio
              </button>
            </div>
          )}

          {/* Rechazado / error */}
          {(state === "rejected" || state === "error") && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
              <div style={{
                width: 72, height: 72, borderRadius: 20,
                background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
              </div>
              <div>
                <h1 style={{ color: TEXT_HI, fontWeight: 800, fontSize: 24, margin: "0 0 10px", letterSpacing: -0.8 }}>
                  {state === "rejected" ? "Pago rechazado" : "Algo salió mal"}
                </h1>
                <p style={{ color: TEXT_MID, fontSize: 14, margin: "0 0 24px", lineHeight: 1.6 }}>
                  {errMsg || "El pago fue rechazado o cancelado. Puedes intentarlo nuevamente."}
                </p>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <button
                  onClick={() => navigate(-1)}
                  style={{
                    background: "linear-gradient(135deg,#7c3aed,#a855f7)", border: "none",
                    borderRadius: 11, padding: "12px 24px",
                    fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 700,
                    color: "#fff", cursor: "pointer",
                    boxShadow: "0 6px 20px rgba(168,85,247,0.25)",
                  }}
                >
                  Intentar de nuevo
                </button>
                <button
                  onClick={() => navigate("/")}
                  style={{
                    background: "transparent", border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 11, padding: "12px 24px",
                    fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 600,
                    color: TEXT_MID, cursor: "pointer",
                  }}
                >
                  Inicio
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}
