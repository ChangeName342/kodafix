import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, sendResetEmail, validateEmail, validatePassword } from "../services/authService";
import { useAuthContext } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuthContext();

  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [showPass, setShowPass]     = useState(false);
  const [error, setError]           = useState("");
  const [formLoading, setFormLoading] = useState(false);

  const [showReset, setShowReset]       = useState(false);
  const [resetEmail, setResetEmail]     = useState("");
  const [resetMsg, setResetMsg]         = useState("");
  const [resetError, setResetError]     = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  const [emailErr, setEmailErr]       = useState("");
  const [passwordErr, setPasswordErr] = useState("");

  // Navega cuando el contexto confirme el usuario
  useEffect(() => {
    if (!authLoading && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, authLoading, navigate]);

  const handleEmailChange = (val: string) => {
    setEmail(val);
    setEmailErr(validateEmail(val));
  };

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    if (val.length > 0) setPasswordErr(validatePassword(val));
    else setPasswordErr("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const eErr = validateEmail(email);
    const pErr = password ? "" : "La contraseña es requerida.";
    setEmailErr(eErr);
    setPasswordErr(pErr);
    if (eErr || pErr) return;

    setFormLoading(true);
    try {
      await loginUser(email, password);
      // No navegamos aquí — el useEffect lo hace cuando el contexto esté listo
    } catch (err: unknown) {
      const msg = (err as Error).message;
      if (msg.includes("user-not-found") || msg.includes("wrong-password") || msg.includes("invalid-credential"))
        setError("Correo o contraseña incorrectos.");
      else if (msg.includes("too-many-requests"))
        setError("Demasiados intentos. Intenta más tarde o restablece tu contraseña.");
      else
        setError(msg);
    } finally {
      setFormLoading(false);
    }
  };

  useEffect(() => {
  console.log("authLoading:", authLoading, "user:", user);
}, [authLoading, user]);

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
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#070710", fontFamily: "'Outfit', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .fade-up   { animation: fadeUp .4s ease both; }
        .fade-up-2 { animation: fadeUp .4s .08s ease both; }
        .fade-up-3 { animation: fadeUp .4s .16s ease both; }
        .input-wrap { position: relative; }
        .input-field {
          width: 100%; padding: 12px 16px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px; color: #f1f0ff;
          font-size: 14px; font-family: 'Outfit', sans-serif;
          outline: none; transition: border-color .2s, background .2s;
        }
        .input-field:focus { border-color: rgba(168,85,247,0.5); background: rgba(168,85,247,0.05); }
        .input-field.error { border-color: rgba(239,68,68,0.5); }
        .input-field::placeholder { color: rgba(241,240,255,0.22); }
        .field-error { font-size: 11px; color: #f87171; margin-top: 5px; display: block; }
        .btn-primary {
          width: 100%; padding: 13px; border: none; border-radius: 10px;
          color: #fff; font-size: 15px; font-weight: 700;
          font-family: 'Outfit', sans-serif; cursor: pointer; transition: all .2s;
          background: linear-gradient(135deg,#7c3aed,#a855f7);
        }
        .btn-primary:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 10px 28px rgba(124,58,237,0.45); }
        .btn-primary:disabled { opacity: 0.55; cursor: not-allowed; }
        .btn-ghost {
          background: none; border: none; cursor: pointer; font-family: 'Outfit', sans-serif;
          transition: color .2s;
        }
        .overlay { animation: fadeIn .2s ease; }
      `}</style>

      {/* Glow */}
      <div style={{ position: "fixed", top: -200, left: "50%", transform: "translateX(-50%)", width: 600, height: 500, pointerEvents: "none", zIndex: 0, background: "radial-gradient(ellipse, rgba(109,40,217,0.2) 0%, transparent 70%)" }} />
      {/* Grid */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", backgroundImage: "linear-gradient(rgba(168,85,247,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.03) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />

      <div className="relative w-full" style={{ maxWidth: 420, zIndex: 10 }}>

        {/* Logo */}
        <div className="fade-up flex flex-col items-center mb-8">
          <div className="flex items-center justify-center rounded-[12px] border mb-4" style={{ width: 52, height: 52, background: "linear-gradient(135deg,#1a0a2e,#2d1557)", borderColor: "rgba(168,85,247,0.35)" }}>
            <svg width="28" height="28" viewBox="0 0 22 22" fill="none">
              <path d="M4 3 Q2 3 2 5.5 L2 8 Q2 10 0.5 10 Q2 10 2 12.5 L2 15 Q2 17 4 17" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              <path d="M18 3 Q20 3 20 5.5 L20 8 Q20 10 21.5 10 Q20 10 20 12.5 L20 15 Q20 17 18 17" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              <line x1="7" y1="4" x2="7" y2="16" stroke="#c084fc" strokeWidth="1.8" strokeLinecap="round" />
              <line x1="7" y1="10" x2="15" y2="4" stroke="#c084fc" strokeWidth="1.8" strokeLinecap="round" />
              <line x1="7" y1="10" x2="15" y2="16" stroke="#c084fc" strokeWidth="1.8" strokeLinecap="round" />
              <circle cx="7" cy="4" r="1.2" fill="#e9d5ff" />
              <circle cx="15" cy="4" r="1.2" fill="#e9d5ff" />
              <circle cx="7" cy="10" r="1.2" fill="#e9d5ff" />
              <circle cx="15" cy="16" r="1.2" fill="#e9d5ff" />
            </svg>
          </div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 20, fontWeight: 700, color: "#a855f7", letterSpacing: -0.5 }}>
            Koda<span style={{ color: "#f1f0ff" }}>Fix</span>
          </span>
          <span style={{ fontSize: 13, color: "rgba(241,240,255,0.35)", marginTop: 4 }}>Panel de administración</span>
        </div>

        {/* Card login */}
        <div className="fade-up-2 rounded-2xl p-8" style={{ background: "#0e0e1a", border: "1px solid rgba(255,255,255,0.06)" }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#f1f0ff", marginBottom: 6, letterSpacing: -0.5 }}>Iniciar sesión</h1>
          <p style={{ fontSize: 13, color: "rgba(241,240,255,0.4)", marginBottom: 28 }}>Acceso exclusivo para administradores</p>

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
                  className={`input-field${passwordErr ? " error" : ""}`}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  style={{ paddingRight: 44 }}
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
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
              {passwordErr && <span className="field-error">{passwordErr}</span>}
            </div>

            {/* ¿Olvidaste tu contraseña? */}
            <div style={{ textAlign: "right", marginBottom: 24 }}>
              <button type="button" className="btn-ghost" onClick={() => { setShowReset(true); setResetEmail(email); }}
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

            <button type="submit" className="btn-primary" disabled={formLoading}>
              {formLoading ? "Verificando..." : "Entrar al panel"}
            </button>
          </form>
        </div>

        {/* Volver */}
        <div className="fade-up-3 text-center mt-6">
          <button className="btn-ghost" onClick={() => navigate("/")}
            style={{ fontSize: 13, color: "rgba(241,240,255,0.3)" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#a855f7")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "rgba(241,240,255,0.3)")}
          >
            ← Volver al sitio
          </button>
        </div>
      </div>

      {/* ── Modal reset contraseña ── */}
      {showReset && (
        <div
          className="overlay"
          style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) { setShowReset(false); setResetMsg(""); setResetError(""); } }}
        >
          <div style={{ background: "#0e0e1a", border: "1px solid rgba(168,85,247,0.2)", borderRadius: 20, padding: 32, width: "100%", maxWidth: 400 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#f1f0ff", letterSpacing: -0.3 }}>Restablecer contraseña</h2>
              <button onClick={() => { setShowReset(false); setResetMsg(""); setResetError(""); }}
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
                <button className="btn-primary" onClick={() => { setShowReset(false); setResetMsg(""); }}>
                  Entendido
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}