import { useState, useRef, useEffect, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

interface Plan {
  id: string;
  nombre: string;
  implementacion: number;
  mensualidad: number;
  descripcion: string;
  incluye: string[];
  badge?: string;
  esDestacado: boolean;
  color: string;
  colorOscuro: string;
  icono: JSX.Element;
}

const WA_CUSTOM = "https://wa.me/56953584105?text=" +
  encodeURIComponent("Hola Koda Fix, necesito un plan personalizado para mi negocio 👋");

export const PLANES: Plan[] = [
  {
    id: "presencia-inicial", nombre: "Presencia Inicial",
    implementacion: 150_000, mensualidad: 30_000,
    descripcion: "Tu negocio en el mapa digital. Todo lo esencial para empezar a recibir clientes en línea.",
    incluye: ["Landing Page profesional","Google Mi Negocio configurado","Botón WhatsApp integrado","Hosting gestionado","Soporte remoto básico"],
    esDestacado: false, color: "#22d3ee", colorOscuro: "#0891b2",
    icono: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  },
  {
    id: "catalogo-organizacion", nombre: "Catálogo y Organización",
    implementacion: 250_000, mensualidad: 50_000,
    descripcion: "Muestra tu oferta y organiza tu empresa. Presencia digital estructurada con identidad propia.",
    incluye: ["Catálogo Digital con código QR","Correos corporativos","Mantenimiento web mensual","Asistencia telemática"],
    esDestacado: false, color: "#34d399", colorOscuro: "#059669",
    icono: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="7" height="9" rx="1"/><rect x="15" y="3" width="7" height="5" rx="1"/><rect x="15" y="12" width="7" height="9" rx="1"/><rect x="2" y="16" width="7" height="5" rx="1"/></svg>,
  },
  {
    id: "operacion-activa", nombre: "Operación Activa",
    implementacion: 380_000, mensualidad: 85_000,
    descripcion: "La elección de quienes quieren crecer de verdad. Agenda online, SEO y soporte prioritario.",
    incluye: ["Sistema de Reservas / Agendamiento","Optimización SEO incluida","Respaldos web automáticos","Soporte telemático prioritario"],
    badge: "Recomendado", esDestacado: true, color: "#a855f7", colorOscuro: "#7c3aed",
    icono: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  },
  {
    id: "venta-automatica", nombre: "Venta Automática",
    implementacion: 550_000, mensualidad: 130_000,
    descripcion: "Vende las 24 horas. E-commerce completo con pasarela de pago y hosting de alto rendimiento.",
    incluye: ["Tienda E-commerce completa","Pasarela de pago integrada","Hosting de alto rendimiento","Soporte remoto extendido"],
    esDestacado: false, color: "#fb923c", colorOscuro: "#ea580c",
    icono: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
  },
  {
    id: "ecosistema-digital", nombre: "Ecosistema Digital",
    implementacion: 850_000, mensualidad: 190_000,
    descripcion: "Infraestructura digital corporativa con ciberseguridad, monitoreo y respuesta de emergencia.",
    incluye: ["Web multisucursal","Auditoría de ciberseguridad web","Monitoreo constante 24/7","Soporte emergencia < 1 hr"],
    badge: "Enterprise", esDestacado: false, color: "#f472b6", colorOscuro: "#db2777",
    icono: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>,
  },
];

const clp = (n: number) =>
  n.toLocaleString("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });

function useInView(threshold = 0.05) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, visible };
}

// ── Popup de confirmación de contratación ─────────────────────────────────────
function ContratarPopup({ plan, onClose, onConfirm, onDetails }: {
  plan: Plan;
  onClose: () => void;
  onConfirm: () => void;
  onDetails: () => void;
}) {
  const { c } = useTheme();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 30);
    return () => clearTimeout(t);
  }, []);

  function close() {
    setVisible(false);
    setTimeout(onClose, 350);
  }

  return (
    <div
      onClick={close}
      style={{
        position: "fixed", inset: 0, zIndex: 300,
        display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
        background: visible ? "rgba(0,0,0,0.75)" : "rgba(0,0,0,0)",
        backdropFilter: visible ? "blur(6px)" : "blur(0px)",
        transition: "background 0.35s ease, backdrop-filter 0.35s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 500, width: "100%",
          background: `linear-gradient(160deg,${c.bgFeat},${c.bgCard})`,
          border: `1px solid ${plan.color}40`,
          borderRadius: 24, padding: "44px 36px 36px",
          boxShadow: `0 0 0 1px ${plan.color}15, 0 40px 100px rgba(0,0,0,0.6), 0 0 80px ${plan.color}20`,
          textAlign: "center", position: "relative", overflow: "hidden",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0) scale(1)" : "translateY(36px) scale(0.94)",
          transition: "opacity 0.4s cubic-bezier(0.16,1,0.3,1), transform 0.4s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        {/* Glow fondo */}
        <div style={{ position: "absolute", top: -80, left: "50%", transform: "translateX(-50%)", width: 360, height: 220, background: `radial-gradient(ellipse,${plan.color}25,transparent 70%)`, pointerEvents: "none" }} />

        {/* Ícono animado */}
        <div style={{
          width: 72, height: 72, borderRadius: 22,
          background: `linear-gradient(135deg,${plan.colorOscuro}30,${plan.color}20)`,
          border: `1px solid ${plan.color}40`,
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 22px", color: plan.color, position: "relative",
          animation: "popBounce 0.6s cubic-bezier(0.34,1.56,0.64,1) both",
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>

        {/* Título */}
        <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: plan.color, marginBottom: 10 }}>
          Estás a punto de contratar
        </p>
        <h2 style={{
          fontFamily: "'Outfit',sans-serif",
          fontSize: "clamp(22px,4vw,28px)", fontWeight: 900, letterSpacing: -1,
          color: c.textHi, margin: "0 0 16px", lineHeight: 1.15,
        }}>
          Plan{" "}
          <span style={{ background: `linear-gradient(135deg,${plan.colorOscuro},${plan.color})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            {plan.nombre}
          </span>
        </h2>

        {/* Mensaje motivador */}
        <p style={{
          fontFamily: "'Outfit',sans-serif", fontSize: 15,
          color: c.textMid, lineHeight: 1.75, margin: "0 0 10px",
        }}>
          Te recomendamos encarecidamente que revises y entiendas bien lo que obtendrás con este plan.
        </p>
        <p style={{
          fontFamily: "'Outfit',sans-serif", fontSize: 15,
          color: c.textHi, fontWeight: 600, lineHeight: 1.65, margin: "0 0 28px",
        }}>
          Pero créenos — tu sueño se hará realidad. 🚀
        </p>

        {/* Precio rápido */}
        <div style={{
          background: `${plan.color}0e`, border: `1px solid ${plan.color}25`,
          borderRadius: 12, padding: "12px 20px", marginBottom: 28,
          display: "flex", justifyContent: "space-around", gap: 16,
        }}>
          <div>
            <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: plan.color, margin: "0 0 3px" }}>Implementación</p>
            <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 18, fontWeight: 700, color: c.textHi, margin: 0 }}>{clp(plan.implementacion)}</p>
          </div>
          <div style={{ width: 1, background: `${plan.color}25` }} />
          <div>
            <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: c.textLow, margin: "0 0 3px" }}>Mensualidad</p>
            <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 18, fontWeight: 700, color: c.textMid, margin: 0 }}>{clp(plan.mensualidad)}<span style={{ fontSize: 11 }}>/mes</span></p>
          </div>
        </div>

        {/* Botones */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button
            onClick={onConfirm}
            style={{
              width: "100%", padding: "15px 20px", borderRadius: 12, border: "none",
              background: `linear-gradient(135deg,${plan.colorOscuro},${plan.color})`,
              color: "#fff", fontFamily: "'Outfit',sans-serif", fontSize: 15, fontWeight: 700,
              cursor: "pointer", boxShadow: `0 10px 32px ${plan.color}40`,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
            Sí, ¡quiero contratar ahora!
          </button>
          <button
            onClick={onDetails}
            style={{
              width: "100%", padding: "13px 20px", borderRadius: 12,
              background: `${plan.color}10`, border: `1px solid ${plan.color}30`,
              color: plan.color, fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 600,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            Primero quiero ver los detalles
          </button>
        </div>

        <p style={{ marginTop: 16, fontSize: 11, color: c.textLow, fontFamily: "'Outfit',sans-serif" }}>
          Sin presión. Siempre puedes volver. 😊
        </p>

        {/* Cerrar X */}
        <button
          onClick={close}
          style={{
            position: "absolute", top: 14, right: 14,
            background: c.bgFeat, border: `1px solid ${c.border}`,
            borderRadius: 8, width: 30, height: 30, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: c.textLow, fontSize: 16,
          }}
        >×</button>

        <style>{`
          @keyframes popBounce {
            from { transform: scale(0.5); opacity: 0; }
            to   { transform: scale(1);   opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  );
}

// ── Bloque de precios ─────────────────────────────────────────────────────────
function PriceBlock({ plan }: { plan: Plan }) {
  const { c } = useTheme();
  return (
    <div style={{
      background: c.bgFeat,
      border: `1px solid ${c.border}`,
      borderRadius: 13, padding: "16px 18px 17px", marginBottom: 20,
    }}>
      <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.13em", textTransform: "uppercase", color: plan.color, margin: "0 0 5px", display: "flex", alignItems: "center", gap: 5 }}>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
        Pago único · Implementación
      </p>
      <div style={{ display: "flex", alignItems: "baseline", gap: 5, marginBottom: 13 }}>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "clamp(22px,2.6vw,28px)", fontWeight: 700, color: c.textHi, letterSpacing: -1, lineHeight: 1 }}>
          {clp(plan.implementacion)}
        </span>
        <span style={{ fontSize: 11, color: c.textLow, fontFamily: "'Outfit',sans-serif" }}>CLP</span>
      </div>
      <div style={{ height: 1, marginBottom: 13, background: `linear-gradient(90deg,${plan.color}22,${c.border},${plan.color}22)` }} />
      <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.13em", textTransform: "uppercase", color: c.textLow, margin: "0 0 5px", display: "flex", alignItems: "center", gap: 5 }}>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        Mensualidad
      </p>
      <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "clamp(18px,2vw,22px)", fontWeight: 700, color: plan.esDestacado ? plan.color : c.textMid, letterSpacing: -0.5, lineHeight: 1 }}>
          {clp(plan.mensualidad)}
        </span>
        <span style={{ fontSize: 11, color: c.textLow, fontFamily: "'Outfit',sans-serif" }}>/ mes</span>
      </div>
    </div>
  );
}

// ── Tarjeta individual ────────────────────────────────────────────────────────
function PlanCard({ plan, index, visible }: { plan: Plan; index: number; visible: boolean }) {
  const [hov, setHov] = useState(false);
  const [tap, setTap] = useState(false);
  const [tapC, setTapC] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const { c } = useTheme();

  return (
    <>
      {showPopup && (
        <ContratarPopup
          plan={plan}
          onClose={() => setShowPopup(false)}
          onConfirm={() => { setShowPopup(false); navigate(`/contratar/${plan.id}`); }}
          onDetails={() => { setShowPopup(false); navigate(`/planes/${plan.id}`); }}
        />
      )}

      <div style={{
        display: "flex", flexDirection: "column",
        marginTop: plan.esDestacado ? 0 : 24,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.5s ease ${index * 70}ms, transform 0.5s ease ${index * 70}ms`,
        zIndex: plan.esDestacado ? 3 : 1,
      }}>
        {/* Badge "Recomendado" encima */}
        {plan.esDestacado && plan.badge && (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <span style={{
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase",
              padding: "6px 22px 22px", borderRadius: "10px 10px 0 0",
              background: `linear-gradient(135deg,${plan.colorOscuro},${plan.color})`,
              boxShadow: `0 -4px 18px ${plan.color}30`, color: "#fff",
            }}>
              {plan.badge}
            </span>
          </div>
        )}

        {/* Cuerpo */}
        <div
          onMouseEnter={() => setHov(true)}
          onMouseLeave={() => setHov(false)}
          style={{
            flex: 1, display: "flex", flexDirection: "column",
            position: "relative", overflow: "hidden",
            background: plan.esDestacado ? c.bgFeat : c.bgCard,
            borderRadius: plan.esDestacado && plan.badge ? "0 14px 14px 14px" : 14,
            border: `1px solid ${plan.esDestacado ? `${plan.color}50` : hov ? `${plan.color}30` : c.border}`,
            boxShadow: plan.esDestacado
              ? `0 0 0 1px ${plan.color}22, 0 28px 70px ${plan.color}20, inset 0 1px 0 ${plan.color}18`
              : hov ? `0 20px 48px rgba(0,0,0,0.18), 0 0 0 1px ${plan.color}18` : "none",
            transform: !plan.esDestacado && hov ? "translateY(-5px)" : "translateY(0)",
            transition: "border-color 0.25s, box-shadow 0.28s, transform 0.28s",
          }}
        >
          {plan.esDestacado && (
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${plan.color},transparent)` }} />
          )}
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none", borderRadius: "inherit", background: `radial-gradient(ellipse 85% 45% at 50% 0%,${plan.color}${plan.esDestacado ? "18" : "0c"},transparent)` }} />

          {!plan.esDestacado && plan.badge && (
            <div style={{
              position: "absolute", top: 14, right: 14,
              fontFamily: "'JetBrains Mono',monospace", fontSize: 9, fontWeight: 700,
              letterSpacing: "0.12em", textTransform: "uppercase",
              padding: "3px 10px", borderRadius: 100,
              background: `${plan.color}12`, border: `1px solid ${plan.color}35`, color: plan.color,
            }}>
              {plan.badge}
            </div>
          )}

          <div style={{ padding: "26px 24px 28px", display: "flex", flexDirection: "column", flex: 1, position: "relative" }}>
            {/* Ícono + nombre */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{
                width: 42, height: 42, flexShrink: 0, borderRadius: 11,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: hov ? `${plan.color}28` : `${plan.color}18`,
                border: `1px solid ${plan.color}30`, color: plan.color,
                transition: "background 0.22s",
              }}>
                <div style={{ width: 20, height: 20 }}>{plan.icono}</div>
              </div>
              <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 16, fontWeight: 700, color: c.textHi, letterSpacing: -0.4, lineHeight: 1.2, margin: 0 }}>
                {plan.nombre}
              </h3>
            </div>

            <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: c.textMid, lineHeight: 1.65, margin: "0 0 18px" }}>
              {plan.descripcion}
            </p>

            <PriceBlock plan={plan} />

            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 22px", display: "flex", flexDirection: "column", gap: 9, flex: 1 }}>
              {plan.incluye.map((item) => (
                <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: 9 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={plan.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2.5 }}>
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: c.textMid, lineHeight: 1.5 }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            {/* Botones */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button
                onClick={() => navigate(`/planes/${plan.id}`)}
                onMouseDown={() => setTap(true)}
                onMouseUp={() => setTap(false)}
                onMouseLeave={() => setTap(false)}
                style={{
                  width: "100%", padding: "13px 16px", borderRadius: 11,
                  fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 700, letterSpacing: 0.1,
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                  transition: "all 0.18s ease",
                  transform: tap ? "scale(0.97)" : "scale(1)",
                  ...(plan.esDestacado
                    ? { background: `linear-gradient(135deg,${plan.colorOscuro},${plan.color})`, border: "none", color: "#fff", boxShadow: hov ? `0 12px 32px ${plan.color}50` : `0 6px 20px ${plan.color}30` }
                    : { background: hov ? `${plan.color}12` : "transparent", border: `1px solid ${hov ? plan.color + "55" : plan.color + "35"}`, color: plan.color }),
                }}
              >
                Me interesa este plan
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>

              <button
                onClick={() => setShowPopup(true)}
                onMouseDown={() => setTapC(true)}
                onMouseUp={() => setTapC(false)}
                onMouseLeave={() => setTapC(false)}
                style={{
                  width: "100%", padding: "11px 16px", borderRadius: 11,
                  fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: 0.1,
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                  transition: "all 0.18s ease",
                  transform: tapC ? "scale(0.97)" : "scale(1)",
                  background: `${plan.color}18`, border: `1px solid ${plan.color}50`, color: plan.color,
                  boxShadow: hov ? `0 6px 20px ${plan.color}25` : "none",
                }}
              >
                Contratar inmediatamente
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ── CSS del grid ──────────────────────────────────────────────────────────────
const GRID_CSS = `
  .pricing-grid { display: grid; gap: 16px; align-items: end; grid-template-columns: 1fr; }
  @media (min-width: 600px)  { .pricing-grid { grid-template-columns: repeat(2,1fr); } }
  @media (min-width: 860px)  { .pricing-grid { grid-template-columns: repeat(3,1fr); } }
  @media (min-width: 1100px) { .pricing-grid { grid-template-columns: repeat(5,1fr); align-items: end; } }
  .wa-medida { color: #a855f7; text-decoration: none; font-weight: 600; border-bottom: 1px solid rgba(168,85,247,0.3); padding-bottom: 1px; transition: color .2s, border-color .2s; }
  .wa-medida:hover { color: #c084fc; border-color: rgba(168,85,247,0.7); }
`;

// ── Componente principal ──────────────────────────────────────────────────────
export default function PricingPlans() {
  const { ref, visible } = useInView();
  const { c } = useTheme();

  return (
    <section id="planes" ref={ref} style={{ position: "relative", zIndex: 5, padding: "88px 24px 108px" }}>
      <style>{GRID_CSS}</style>
      <div style={{ maxWidth: 1380, margin: "0 auto" }}>

        <div style={{ textAlign: "center", marginBottom: 56, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.5s ease, transform 0.5s ease" }}>
          <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#a855f7", marginBottom: 16 }}>
            {"// planes & precios"}
          </p>
          <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: "clamp(28px,5vw,48px)", fontWeight: 900, letterSpacing: -2, color: c.textHi, lineHeight: 1.05, margin: "0 0 18px" }}>
            Servicios digitales que<br/>
            <span style={{ background: "linear-gradient(135deg,#a855f7 0%,#22d3ee 52%,#f472b6 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              hacen crecer tu negocio
            </span>
          </h2>
          <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 16, color: c.textMid, maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>
            Un pago único de implementación y una mensualidad de soporte telemático. Sin letra chica, sin sorpresas.
          </p>
        </div>

        <div className="pricing-grid">
          {PLANES.map((plan, i) => (
            <PlanCard key={plan.id} plan={plan} index={i} visible={visible} />
          ))}
        </div>

        <p style={{ fontFamily: "'Outfit',sans-serif", textAlign: "center", marginTop: 48, fontSize: 13.5, color: c.textLow, lineHeight: 1.9, opacity: visible ? 1 : 0, transition: "opacity 0.6s ease 0.5s" }}>
          Todos los precios incluyen IVA · La implementación se paga una sola vez
          <br />
          <a href={WA_CUSTOM} target="_blank" rel="noopener noreferrer" className="wa-medida">
            ¿Necesitas algo a medida?
          </a>
          {" "}Escríbenos y diseñamos el plan exacto para tu empresa.
        </p>
      </div>
    </section>
  );
}
