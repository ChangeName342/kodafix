import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { useAuthContext } from "../context/AuthContext";
import LoginForm from "../components/login/LoginForm";
import ResetPasswordModal from "../components/login/ResetPasswordModal";

export default function Login() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuthContext();

  const [formLoading, setFormLoading] = useState(false);
  const [error, setError]             = useState("");
  const [showReset, setShowReset]     = useState(false);
  const [resetEmail, setResetEmail]   = useState("");

  // Redirige cuando el contexto confirme el usuario
  useEffect(() => {
    if (!authLoading && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (email: string, password: string) => {
    setError("");
    setFormLoading(true);
    try {
      await loginUser(email, password);
      // El useEffect detecta el cambio de user y navega
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

  const handleForgotPassword = (email: string) => {
    setResetEmail(email);
    setShowReset(true);
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
        .btn-ghost { background: none; border: none; cursor: pointer; font-family: 'Outfit', sans-serif; transition: color .2s; }
        .overlay { animation: fadeIn .2s ease; }
      `}</style>

      {/* Glow */}
      <div style={{ position: "fixed", top: -200, left: "50%", transform: "translateX(-50%)", width: 600, height: 500, pointerEvents: "none", zIndex: 0, background: "radial-gradient(ellipse, rgba(109,40,217,0.2) 0%, transparent 70%)" }} />
      {/* Grid */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", backgroundImage: "linear-gradient(rgba(168,85,247,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.03) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />

      <div className="relative w-full" style={{ maxWidth: 420, zIndex: 10 }}>

        {/* Logo */}
        <div className="fade-up flex flex-col items-center mb-8">
            <img src="/logo.png" alt="KodaFix" style={{ width: 52, height: 52, objectFit: "contain", marginBottom: 16 }} />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 20, fontWeight: 700, color: "#a855f7", letterSpacing: -0.5 }}>
            Koda<span style={{ color: "#f1f0ff" }}>Fix</span>
          </span>
          <span style={{ fontSize: 13, color: "rgba(241,240,255,0.35)", marginTop: 4 }}>Panel de administración</span>
        </div>

        {/* Card */}
        <div className="fade-up-2 rounded-2xl p-8" style={{ background: "#0e0e1a", border: "1px solid rgba(255,255,255,0.06)" }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#f1f0ff", marginBottom: 6, letterSpacing: -0.5 }}>Iniciar sesión</h1>
          <p style={{ fontSize: 13, color: "rgba(241,240,255,0.4)", marginBottom: 28 }}>Acceso exclusivo para administradores</p>

          <LoginForm
            onSubmit={handleSubmit}
            onForgotPassword={handleForgotPassword}
            loading={formLoading}
            error={error}
          />
        </div>

        {/* Volver */}
        <div className="fade-up-3 text-center mt-6">
          <button
            className="btn-ghost"
            onClick={() => navigate("/")}
            style={{ fontSize: 13, color: "rgba(241,240,255,0.3)" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#a855f7")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "rgba(241,240,255,0.3)")}
          >
            ← Volver al sitio
          </button>
        </div>
      </div>

      {/* Modal reset */}
      {showReset && (
        <ResetPasswordModal
          initialEmail={resetEmail}
          onClose={() => setShowReset(false)}
        />
      )}
    </div>
  );
}