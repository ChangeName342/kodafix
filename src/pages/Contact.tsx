import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/config";
import Navbar from "../components/Navbar";
import ParticleCanvas from "../components/ParticleCanvas";

// ── Obtener emails de fundadores ──────────────────────────────────────────────

async function getFounderEmails(): Promise<string[]> {
  const q = query(collection(db, "users"), where("role", "==", "founder"));
  const snap = await getDocs(q);
  return snap.docs.map((doc) => doc.data().email as string);
}

// ── Lookup de planes ──────────────────────────────────────────────────────────

const PLANES_INFO: Record<string, { nombre: string; color: string; colorOscuro: string; emoji: string }> = {
  "presencia-inicial":     { nombre: "Presencia Inicial",      color: "#22d3ee", colorOscuro: "#0891b2", emoji: "🌐" },
  "catalogo-organizacion": { nombre: "Catálogo y Organización", color: "#34d399", colorOscuro: "#059669", emoji: "📋" },
  "operacion-activa":      { nombre: "Operación Activa",        color: "#a855f7", colorOscuro: "#7c3aed", emoji: "⚡" },
  "venta-automatica":      { nombre: "Venta Automática",        color: "#fb923c", colorOscuro: "#ea580c", emoji: "🛒" },
  "ecosistema-digital":    { nombre: "Ecosistema Digital",      color: "#f472b6", colorOscuro: "#db2777", emoji: "🏢" },
};

const MOTIVOS_BASE = [
  "Consulta general",
  "Soporte técnico",
  "Colaboración",
  "Servicios Web",
  "Otro",
];

type FormData = {
  from_name:  string;
  from_email: string;
  phone:      string;
  motivo:     string;
  message:    string;
};

const EMPTY: FormData = {
  from_name: "", from_email: "", phone: "", motivo: "", message: "",
};

// ── Validación ────────────────────────────────────────────────────────────────

function validate(data: FormData) {
  const errors: Partial<FormData> = {};
  if (!data.from_name.trim())  errors.from_name  = "El nombre es requerido.";
  if (!data.from_email.trim()) errors.from_email = "El correo es requerido.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.from_email))
    errors.from_email = "El formato del correo no es válido.";
  if (!data.phone.trim())      errors.phone      = "El teléfono es requerido.";
  else if (!/^\+?[\d\s\-()]{7,15}$/.test(data.phone))
    errors.phone = "Ingresa un teléfono válido.";
  if (!data.motivo)            errors.motivo     = "Selecciona un motivo.";
  if (!data.message.trim())    errors.message    = "La descripción es requerida.";
  else if (data.message.trim().length < 20)
    errors.message = "La descripción debe tener al menos 20 caracteres.";
  return errors;
}

// ── Field ─────────────────────────────────────────────────────────────────────

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(241,240,255,0.5)", marginBottom: 8, letterSpacing: "0.05em", textTransform: "uppercase" }}>
        {label}
      </label>
      {children}
      {error && <span style={{ fontSize: 11, color: "#f87171", marginTop: 5, display: "block" }}>{error}</span>}
    </div>
  );
}

// ── Contact ───────────────────────────────────────────────────────────────────

export default function Contact() {
  const [searchParams] = useSearchParams();
  const planId   = searchParams.get("plan") ?? "";
  const planInfo = planId ? PLANES_INFO[planId] : null;

  const motivoContrato = planInfo ? `Contratar — ${planInfo.nombre}` : "";

  const [form, setForm]           = useState<FormData>({ ...EMPTY, motivo: motivoContrato });
  const [errors, setErrors]       = useState<Partial<FormData>>({});
  const [loading, setLoading]     = useState(false);
  const [sent, setSent]           = useState(false);
  const [sendError, setSendError] = useState("");

  useEffect(() => {
    setForm((prev) => ({ ...prev, motivo: motivoContrato }));
  }, [planId]);

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendError("");
    const errs = validate(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    try {
      // Obtiene emails de todos los fundadores
      const founderEmails = await getFounderEmails();
      if (founderEmails.length === 0) {
        setSendError("No hay destinatarios disponibles. Intenta más tarde.");
        return;
      }

      // Envía a cada fundador incluyendo el plan si viene de uno
      await Promise.all(
        founderEmails.map((email) =>
          emailjs.send(
            import.meta.env.VITE_EMAILJS_SERVICE_ID,
            import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
            {
              to_email:   email,
              from_name:  form.from_name,
              from_email: form.from_email,
              phone:      form.phone,
              motivo:     form.motivo,
              message:    form.message,
              // Plan seleccionado — vacío si vino por "Hablemos"
              plan_nombre: planInfo ? `${planInfo.emoji} ${planInfo.nombre}` : "Sin plan seleccionado",
              plan_id:     planId || "—",
            },
            import.meta.env.VITE_EMAILJS_PUBLIC_KEY
          )
        )
      );

      setSent(true);
      setForm(EMPTY);
    } catch {
      setSendError("Hubo un problema al enviar el mensaje. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const motivos = planInfo
    ? [motivoContrato, ...MOTIVOS_BASE]
    : MOTIVOS_BASE;

  return (
    <div
      className="min-h-screen text-white overflow-x-hidden"
      style={{ background: "#070710", fontFamily: "'Outfit', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; }
        .nav-link { transition: color .2s, background .2s; }
        .nav-link:hover { color: #fff !important; background: rgba(168,85,247,0.1) !important; }
        @keyframes fadeDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes bannerIn { from { opacity:0; transform:translateY(-12px) scale(0.98); } to { opacity:1; transform:translateY(0) scale(1); } }
        .mobile-menu  { animation: fadeDown .2s ease; }
        .plan-banner  { animation: bannerIn 0.45s cubic-bezier(0.34,1.4,0.64,1) both; }
        .contact-input {
          width: 100%; padding: 11px 14px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px; color: #f1f0ff;
          font-size: 14px; font-family: 'Outfit', sans-serif;
          outline: none; transition: border-color .2s, background .2s;
        }
        .contact-input:focus { border-color: rgba(168,85,247,0.5); background: rgba(168,85,247,0.04); }
        .contact-input.err   { border-color: rgba(239,68,68,0.5); }
        .contact-input::placeholder { color: rgba(241,240,255,0.22); }
        .contact-input option { background: #0e0e1a; color: #f1f0ff; }
      `}</style>

      <ParticleCanvas />

      {/* Glow — cambia color según el plan */}
      <div
        className="fixed pointer-events-none"
        style={{
          top: -200, left: "50%", transform: "translateX(-50%)",
          width: 700, height: 500, zIndex: 1,
          background: planInfo
            ? `radial-gradient(ellipse, ${planInfo.color}15 0%, transparent 70%)`
            : "radial-gradient(ellipse, rgba(109,40,217,0.18) 0%, transparent 70%)",
        }}
      />

      {/* Grid */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", backgroundImage: "linear-gradient(rgba(168,85,247,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.03) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />

      <Navbar />

      <section
        className="relative px-6 md:px-12 py-16 md:py-20 mx-auto"
        style={{ zIndex: 5, maxWidth: 1100 }}
      >
        {/* Banner del plan seleccionado */}
        {planInfo && (
          <div
            className="plan-banner"
            style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              background: `${planInfo.color}10`,
              border: `1px solid ${planInfo.color}30`,
              borderRadius: 12, padding: "10px 18px", marginBottom: 32,
            }}
          >
            <span style={{ fontSize: 18 }}>{planInfo.emoji}</span>
            <div>
              <span style={{ fontSize: 11, fontWeight: 700, color: planInfo.color, letterSpacing: "0.1em", textTransform: "uppercase", display: "block" }}>
                Plan seleccionado
              </span>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#f1f0ff" }}>
                {planInfo.nombre}
              </span>
            </div>
          </div>
        )}

        {/* Header */}
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#a855f7", marginBottom: 12 }}>
          Contacto
        </p>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4" style={{ marginBottom: 52 }}>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 44px)", fontWeight: 800, letterSpacing: -1.5, color: "#f1f0ff", lineHeight: 1.1 }}>
            {planInfo ? `Contratar ${planInfo.nombre}` : "Hablemos de\ntu proyecto"}
          </h1>
          <p style={{ fontSize: 16, color: "rgba(241,240,255,0.55)", maxWidth: 400, lineHeight: 1.6 }}>
            {planInfo
              ? `Cuéntanos sobre tu negocio y coordinaremos la implementación del Plan ${planInfo.nombre}.`
              : "Cuéntanos qué necesitas y nos pondremos en contacto contigo a la brevedad."}
          </p>
        </div>

        <div className="grid gap-12" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>

          {/* Formulario */}
          <div
            className="rounded-2xl p-8"
            style={{ background: "#0e0e1a", border: `1px solid ${planInfo ? planInfo.color + "20" : "rgba(255,255,255,0.06)"}` }}
          >
            {sent ? (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: "#f1f0ff", marginBottom: 8 }}>¡Mensaje enviado!</h3>
                <p style={{ fontSize: 14, color: "rgba(241,240,255,0.5)", marginBottom: 28, lineHeight: 1.6 }}>
                  Recibimos tu solicitud{planInfo ? ` para el Plan ${planInfo.nombre}` : ""}. Nos pondremos en contacto contigo pronto.
                </p>
                <button
                  onClick={() => { setSent(false); setForm({ ...EMPTY, motivo: motivoContrato }); }}
                  style={{ background: "linear-gradient(135deg,#7c3aed,#a855f7)", border: "none", color: "#fff", padding: "10px 24px", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 18 }}>

                <Field label="Nombre completo" error={errors.from_name}>
                  <input type="text" className={`contact-input${errors.from_name ? " err" : ""}`} placeholder="Nombre" value={form.from_name} onChange={(e) => handleChange("from_name", e.target.value)} />
                </Field>

                <Field label="Correo electrónico" error={errors.from_email}>
                  <input type="email" className={`contact-input${errors.from_email ? " err" : ""}`} placeholder="tu@correo.com" value={form.from_email} onChange={(e) => handleChange("from_email", e.target.value)} />
                </Field>

                <Field label="Teléfono" error={errors.phone}>
                  <input type="tel" className={`contact-input${errors.phone ? " err" : ""}`} placeholder="+56 9 1234 5678" value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} />
                </Field>

                <Field label="Motivo de contacto" error={errors.motivo}>
                  <select
                    className={`contact-input${errors.motivo ? " err" : ""}`}
                    value={form.motivo}
                    onChange={(e) => handleChange("motivo", e.target.value)}
                    style={{ appearance: "none", cursor: "pointer" }}
                  >
                    <option value="" disabled>Selecciona un motivo</option>
                    {motivos.map((m) => (
                      <option key={m} value={m} style={{ background: "#0e0e1a" }}>{m}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Descripción" error={errors.message}>
                  <textarea
                    className={`contact-input${errors.message ? " err" : ""}`}
                    placeholder={planInfo ? `Cuéntanos sobre tu negocio para implementar el Plan ${planInfo.nombre}...` : "Cuéntanos en detalle qué necesitas..."}
                    value={form.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    rows={4}
                    style={{ resize: "vertical", minHeight: 100 }}
                  />
                </Field>

                {sendError && (
                  <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#f87171" }}>
                    {sendError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    background: loading
                      ? "rgba(124,58,237,0.5)"
                      : planInfo
                        ? `linear-gradient(135deg,${planInfo.colorOscuro},${planInfo.color})`
                        : "linear-gradient(135deg,#7c3aed,#a855f7)",
                    border: "none", color: "#fff", padding: "13px",
                    borderRadius: 10, fontSize: 15, fontWeight: 700,
                    cursor: loading ? "not-allowed" : "pointer",
                    fontFamily: "'Outfit', sans-serif", transition: "all .2s", marginTop: 4,
                  }}
                  onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 10px 28px rgba(124,58,237,0.45)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = ""; }}
                >
                  {loading ? "Enviando..." : planInfo ? `Solicitar Plan ${planInfo.nombre}` : "Enviar mensaje"}
                </button>
              </form>
            )}
          </div>

          {/* Info lateral */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24, justifyContent: "center" }}>
            {[
              { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>, title: "Correo", value: "contacto@kodafix.cl" },
              { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, title: "Respuesta", value: "En menos de 24 horas" },
            ].map((item) => (
              <div key={item.title} style={{ display: "flex", alignItems: "center", gap: 16, padding: "20px 24px", background: "#0e0e1a", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {item.icon}
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(241,240,255,0.35)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{item.title}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#f1f0ff" }}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
}
