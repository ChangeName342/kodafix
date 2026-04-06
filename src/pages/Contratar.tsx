import { useState, useRef, type FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { httpsCallable, type FunctionsError } from "firebase/functions";
import { signInAnonymously } from "firebase/auth";
import { functions, auth } from "../firebase/config";
import { PLANES } from "../components/PricingPlans";
import { useTheme } from "../context/ThemeContext";

const clp = (n: number) =>
  n.toLocaleString("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });

export default function Contratar() {
  const { planId } = useParams<{ planId: string }>();
  const navigate   = useNavigate();
  const plan       = PLANES.find((p) => p.id === planId);
  const { c }      = useTheme();
  const BG       = c.bg;
  const TEXT_HI  = c.textHi;
  const TEXT_MID = c.textMid;
  const TEXT_LOW = c.textLow;

  const inputStyle: React.CSSProperties = {
    width: "100%", boxSizing: "border-box",
    background: c.bgCard,
    border: `1px solid ${c.border}`,
    borderRadius: 10, padding: "12px 14px",
    fontFamily: "'Outfit',sans-serif", fontSize: 14, color: TEXT_HI,
    outline: "none", transition: "border-color 0.2s",
  };
  const labelStyle: React.CSSProperties = {
    display: "block", fontFamily: "'Outfit',sans-serif",
    fontSize: 12, fontWeight: 600,
    color: TEXT_MID, marginBottom: 7, letterSpacing: "0.04em",
  };

  const [nombre,     setNombre]     = useState("");
  const [email,      setEmail]      = useState("");
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [iframeReady, setIframeReady] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  if (!plan) {
    return (
      <div style={{ background: BG, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: TEXT_MID, fontFamily: "'Outfit',sans-serif", marginBottom: 20 }}>Plan no encontrado.</p>
          <button
            onClick={() => navigate("/#planes")}
            style={{ background: "transparent", border: "1px solid rgba(168,85,247,0.4)", color: "#a855f7", borderRadius: 10, padding: "10px 24px", cursor: "pointer", fontFamily: "'Outfit',sans-serif", fontSize: 14 }}
          >
            Ver planes
          </button>
        </div>
      </div>
    );
  }

  async function handlePay(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!nombre.trim() || !email.trim()) {
      setError("Completa todos los campos.");
      return;
    }

    setLoading(true);
    try {
      if (!auth.currentUser) await signInAnonymously(auth);

      const createFlowPayment = httpsCallable<
        { planId: string; planNombre: string; amount: number; email: string; nombre: string },
        { paymentUrl: string; orderId: string }
      >(functions, "createFlowPayment");

      const result = await createFlowPayment({
        planId:     plan.id,
        planNombre: plan.nombre,
        amount:     plan.implementacion,
        email:      email.trim(),
        nombre:     nombre.trim(),
      });

      setIframeReady(false);
      setPaymentUrl(result.data.paymentUrl);
    } catch (err: unknown) {
      const fe = err as FunctionsError;
      const detail = fe.details ? `\n${JSON.stringify(fe.details, null, 2)}` : "";
      setError(`${fe.code ?? "error"}: ${fe.message ?? "Error inesperado"}${detail}`);
      setLoading(false);
    }
  }

  // Detecta cuando el iframe navega de vuelta a nuestro dominio (urlReturn)
  function handleIframeLoad() {
    setIframeReady(true);
    setLoading(false);
    try {
      const href = iframeRef.current?.contentWindow?.location.href ?? "";
      if (href.includes("/pago/resultado")) {
        const token = new URL(href).searchParams.get("token");
        if (token) navigate(`/pago/resultado?token=${token}`);
      }
    } catch {
      // Cross-origin (aún en Flow) — normal, ignorar
    }
  }

  return (
    <div style={{ background: BG, minHeight: "100vh", fontFamily: "'Outfit',sans-serif", transition: "background 0.3s" }}>

      {/* Overlay iframe de pago */}
      {paymentUrl && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1000,
          background: "rgba(0,0,0,0.75)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: 20,
        }}>
          <div style={{
            width: "100%", maxWidth: 780,
            background: "#fff", borderRadius: 16,
            overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
            display: "flex", flexDirection: "column",
            maxHeight: "90vh",
          }}>
            {/* Barra superior del modal */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "14px 18px",
              background: "#f8f8f8", borderBottom: "1px solid #e5e5e5",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 600, color: "#333" }}>
                  Pago seguro · Flow
                </span>
              </div>
              <button
                onClick={() => { setPaymentUrl(null); setLoading(false); }}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "#666", fontSize: 20, lineHeight: 1, padding: "0 4px" }}
                title="Cancelar pago"
              >
                ×
              </button>
            </div>

            {/* Spinner mientras carga el iframe */}
            {!iframeReady && (
              <div style={{ padding: 48, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, background: "#fff" }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" style={{ animation: "spin 0.8s linear infinite" }}>
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
                <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: "#555", margin: 0 }}>
                  Cargando pasarela de pago…
                </p>
              </div>
            )}

            <iframe
              ref={iframeRef}
              src={paymentUrl}
              onLoad={handleIframeLoad}
              style={{
                width: "100%",
                flex: 1,
                minHeight: 520,
                border: "none",
                display: iframeReady ? "block" : "none",
              }}
              title="Pasarela de pago Flow"
              allow="payment"
            />
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "18px 32px", display: "flex", alignItems: "center", gap: 12 }}>
        <button
          onClick={() => navigate(-1)}
          style={{ background: "transparent", border: "none", cursor: "pointer", color: TEXT_MID, display: "flex", alignItems: "center", gap: 6, fontSize: 14, padding: 0 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Volver
        </button>
        <div style={{ width: 1, height: 18, background: "rgba(255,255,255,0.1)" }} />
        <span style={{ color: TEXT_MID, fontSize: 13 }}>Contratación · {plan.nombre}</span>
      </div>

      <div style={{ maxWidth: 520, margin: "60px auto", padding: "0 24px 60px" }}>

        {/* Resumen del plan */}
        <div style={{
          background: c.bgCard, border: `1px solid ${plan.color}30`,
          borderRadius: 16, padding: "24px 24px 20px", marginBottom: 24,
          boxShadow: `0 0 0 1px ${plan.color}0a, 0 20px 50px ${plan.color}10`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{
              width: 42, height: 42, flexShrink: 0, borderRadius: 11,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: `${plan.color}18`, border: `1px solid ${plan.color}30`, color: plan.color,
            }}>
              <div style={{ width: 20, height: 20 }}>{plan.icono}</div>
            </div>
            <div>
              <h1 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 18, fontWeight: 800, color: TEXT_HI, margin: 0, letterSpacing: -0.4 }}>
                {plan.nombre}
              </h1>
              <p style={{ fontSize: 12, color: TEXT_MID, margin: "2px 0 0" }}>{plan.descripcion}</p>
            </div>
          </div>

          <div style={{ height: 1, background: "rgba(255,255,255,0.05)", marginBottom: 16 }} />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: plan.color, margin: "0 0 4px" }}>
                Pago único · Implementación
              </p>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 24, fontWeight: 700, color: TEXT_HI, letterSpacing: -0.5 }}>
                {clp(plan.implementacion)}
              </span>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: TEXT_LOW, margin: "0 0 4px" }}>
                Luego mensual
              </p>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 16, fontWeight: 700, color: "rgba(241,240,255,0.6)", letterSpacing: -0.5 }}>
                {clp(plan.mensualidad)}<span style={{ fontSize: 11, fontWeight: 400, color: TEXT_LOW }}>/mes</span>
              </span>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <div style={{ background: c.bgCard, border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "28px 24px" }}>
          <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 16, fontWeight: 700, color: TEXT_HI, margin: "0 0 20px", letterSpacing: -0.3 }}>
            Tus datos de facturación
          </h2>

          <form onSubmit={handlePay} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={labelStyle}>Nombre completo</label>
              <input
                type="text" value={nombre} onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Juan Pérez" required style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = `${plan.color}60`)}
                onBlur={(e)  => (e.target.style.borderColor = "rgba(255,255,255,0.10)")}
              />
            </div>

            <div>
              <label style={labelStyle}>Correo electrónico</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com" required style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = `${plan.color}60`)}
                onBlur={(e)  => (e.target.style.borderColor = "rgba(255,255,255,0.10)")}
              />
              <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, color: TEXT_LOW, margin: "6px 0 0" }}>
                Flow enviará el comprobante de pago a este correo.
              </p>
            </div>

            {error && (
              <div style={{
                background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)",
                borderRadius: 9, padding: "10px 14px",
                fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "#f87171",
                wordBreak: "break-all",
              }}>
                {error}
              </div>
            )}

            <button
              type="submit" disabled={loading}
              style={{
                width: "100%", padding: "14px 16px", borderRadius: 11, border: "none",
                fontFamily: "'Outfit',sans-serif", fontSize: 15, fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                background: loading ? "rgba(168,85,247,0.3)" : `linear-gradient(135deg,${plan.colorOscuro},${plan.color})`,
                color: "#fff",
                boxShadow: loading ? "none" : `0 8px 24px ${plan.color}30`,
                transition: "all 0.2s ease", marginTop: 4,
              }}
            >
              {loading ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: "spin 0.8s linear infinite" }}>
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                  Procesando…
                </>
              ) : (
                <>
                  Ir a pagar con Flow
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: TEXT_LOW, lineHeight: 1.7 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline", marginRight: 4, verticalAlign: "middle" }}>
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          Pago seguro procesado por Flow · Tus datos están protegidos
        </p>
        <p style={{ textAlign: "center", marginTop: 10, fontSize: 11, color: TEXT_LOW, lineHeight: 1.7 }}>
          Al completar tu contratación aceptas los{" "}
          <a href="/terminos" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(168,85,247,0.7)", textDecoration: "none", borderBottom: "1px solid rgba(168,85,247,0.3)", paddingBottom: 1 }}>
            Términos y Condiciones
          </a>
          {" "}y la{" "}
          <a href="/terminos#privacidad" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(168,85,247,0.7)", textDecoration: "none", borderBottom: "1px solid rgba(168,85,247,0.3)", paddingBottom: 1 }}>
            Política de Privacidad
          </a>
          {" "}de Koda Fix.
        </p>

        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    </div>
  );
}
