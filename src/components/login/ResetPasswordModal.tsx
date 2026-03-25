import { useState } from "react";
import { sendResetEmail, validateEmail } from "../../services/authService";

type Props = {
  initialEmail?: string;
  onClose: () => void;
};

export default function ResetPasswordModal({ initialEmail = "", onClose }: Props) {
  const [resetEmail, setResetEmail]     = useState(initialEmail);
  const [resetMsg, setResetMsg]         = useState("");
  const [resetError, setResetError]     = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError("");
    setResetMsg("");

    const err = validateEmail(resetEmail);
    if (err) { setResetError(err); return; }

    setResetLoading(true);
    try {
      await sendResetEmail(resetEmail);
      setResetMsg("Correo enviado. Revisa tu bandeja de entrada.");
    } catch (err: unknown) {
      const msg = (err as Error).message;
      if (msg.includes("user-not-found"))
        setResetError("No existe una cuenta con ese correo.");
      else
        setResetError(msg);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div
      className="overlay"
      style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ background: "#0e0e1a", border: "1px solid rgba(168,85,247,0.2)", borderRadius: 20, padding: 32, width: "100%", maxWidth: 400 }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#f1f0ff", letterSpacing: -0.3 }}>
            Restablecer contraseña
          </h2>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(241,240,255,0.3)", transition: "color .2s" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#f1f0ff")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "rgba(241,240,255,0.3)")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <p style={{ fontSize: 13, color: "rgba(241,240,255,0.45)", marginBottom: 24, lineHeight: 1.6 }}>
          Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
        </p>

        {!resetMsg ? (
          <form onSubmit={handleReset} noValidate>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(241,240,255,0.5)", marginBottom: 8, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Correo electrónico
              </label>
              <input
                type="email"
                className={`input-field${resetError ? " error" : ""}`}
                placeholder="admin@kodafix.com"
                value={resetEmail}
                onChange={(e) => { setResetEmail(e.target.value); setResetError(""); }}
                autoComplete="email"
              />
              {resetError && <span className="field-error">{resetError}</span>}
            </div>
            <button type="submit" className="btn-primary" disabled={resetLoading}>
              {resetLoading ? "Enviando..." : "Enviar correo"}
            </button>
          </form>
        ) : (
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <p style={{ fontSize: 14, color: "#34d399", fontWeight: 600, marginBottom: 8 }}>Correo enviado</p>
            <p style={{ fontSize: 13, color: "rgba(241,240,255,0.45)", marginBottom: 24 }}>{resetMsg}</p>
            <button className="btn-primary" onClick={onClose}>Entendido</button>
          </div>
        )}
      </div>
    </div>
  );
}