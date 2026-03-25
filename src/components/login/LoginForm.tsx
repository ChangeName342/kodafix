import { useState } from "react";
import { validateEmail, validatePassword } from "../../services/authService";

type Props = {
  onSubmit: (email: string, password: string) => Promise<void>;
  onForgotPassword: (email: string) => void;
  loading: boolean;
  error: string;
};

export default function LoginForm({ onSubmit, onForgotPassword, loading, error }: Props) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [emailErr, setEmailErr] = useState("");
  const [passErr, setPassErr]   = useState("");

  const handleEmailChange = (val: string) => {
    setEmail(val);
    setEmailErr(validateEmail(val));
  };

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    if (val.length > 0) setPassErr(validatePassword(val));
    else setPassErr("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const eErr = validateEmail(email);
    const pErr = password ? "" : "La contraseña es requerida.";
    setEmailErr(eErr);
    setPassErr(pErr);
    if (eErr || pErr) return;

    await onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>

      {/* Email */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(241,240,255,0.5)", marginBottom: 8, letterSpacing: "0.05em", textTransform: "uppercase" }}>
          Correo electrónico
        </label>
        <input
          type="email"
          className={`input-field${emailErr ? " error" : ""}`}
          placeholder="admin@kodafix.com"
          value={email}
          onChange={(e) => handleEmailChange(e.target.value)}
          autoComplete="email"
        />
        {emailErr && <span className="field-error">{emailErr}</span>}
      </div>

      {/* Contraseña */}
      <div style={{ marginBottom: 8 }}>
        <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(241,240,255,0.5)", marginBottom: 8, letterSpacing: "0.05em", textTransform: "uppercase" }}>
          Contraseña
        </label>
        <div className="input-wrap">
          <input
            type={showPass ? "text" : "password"}
            className={`input-field${passErr ? " error" : ""}`}
            placeholder="••••••••"
            value={password}
            onChange={(e) => handlePasswordChange(e.target.value)}
            style={{ paddingRight: 44 }}
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(241,240,255,0.3)", transition: "color .2s", padding: 4 }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#a855f7")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "rgba(241,240,255,0.3)")}
          >
            {showPass
              ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            }
          </button>
        </div>
        {passErr && <span className="field-error">{passErr}</span>}
      </div>

      {/* ¿Olvidaste tu contraseña? */}
      <div style={{ textAlign: "right", marginBottom: 24 }}>
        <button
          type="button"
          className="btn-ghost"
          onClick={() => onForgotPassword(email)}
          style={{ fontSize: 12, color: "rgba(241,240,255,0.35)" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#a855f7")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "rgba(241,240,255,0.35)")}
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>

      {/* Error general */}
      {error && (
        <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#f87171" }}>
          {error}
        </div>
      )}

      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? "Verificando..." : "Entrar al panel"}
      </button>
    </form>
  );
}