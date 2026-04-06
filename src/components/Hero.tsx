import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

const SCROLL_CSS = `
  /* ── Mouse (desktop) ── */
  @keyframes wheelScroll {
    0%   { transform: translateY(0);   opacity: 1; }
    60%  { transform: translateY(6px); opacity: 0.2; }
    100% { transform: translateY(0);   opacity: 1; }
  }
  .scroll-wheel {
    animation: wheelScroll 1.8s ease-in-out infinite;
  }

  /* ── Dedo deslizando (mobile) ── */
  @keyframes fingerSwipe {
    0%   { transform: translateY(0px);  opacity: 0.9; }
    40%  { transform: translateY(10px); opacity: 0.5; }
    70%  { transform: translateY(14px); opacity: 0.15; }
    71%  { transform: translateY(-4px); opacity: 0; }
    85%  { transform: translateY(0px);  opacity: 0.9; }
    100% { transform: translateY(0px);  opacity: 0.9; }
  }
  .scroll-finger {
    animation: fingerSwipe 2s ease-in-out infinite;
  }

  /* Fade in suave del indicador completo */
  @keyframes indicatorFadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 0.5; transform: translateY(0); }
  }
  .scroll-indicator-wrap {
    animation: indicatorFadeIn 1s ease 1.2s both;
  }
`;

// ── Ícono de mouse (desktop) ──────────────────────────────────────────────────
function MouseIcon({ color }: { color: string }) {
  return (
    <svg width="24" height="38" viewBox="0 0 24 38" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Cuerpo del mouse */}
      <rect x="1" y="1" width="22" height="36" rx="11" stroke={color} strokeWidth="1.5"/>
      {/* División central */}
      <line x1="12" y1="1" x2="12" y2="16" stroke={color} strokeWidth="1" strokeOpacity="0.4"/>
      {/* Ruedita animada */}
      <rect
        className="scroll-wheel"
        x="9.5" y="8" width="5" height="8" rx="2.5"
        fill={color}
      />
    </svg>
  );
}

// ── Ícono de dedo (mobile) ────────────────────────────────────────────────────
function FingerIcon({ color }: { color: string }) {
  return (
    <svg width="32" height="44" viewBox="0 0 32 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Líneas de swipe (estelas) */}
      <line x1="8"  y1="38" x2="8"  y2="44" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.25"/>
      <line x1="16" y1="36" x2="16" y2="44" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.4"/>
      <line x1="24" y1="38" x2="24" y2="44" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.25"/>

      {/* Dedo animado */}
      <g className="scroll-finger">
        {/* Palma */}
        <path
          d="M8 28 C8 28 6 24 6 20 C6 17.8 7.8 16 10 16 C10.8 16 11.5 16.3 12 16.7 C12.5 14.6 14.3 13 16.5 13 C18.7 13 20.5 14.6 21 16.7 C21.5 16.3 22.2 16 23 16 C25.2 16 27 17.8 27 20 L27 28 C27 32.4 23.4 36 19 36 L13 36 C10.2 36 8 33.8 8 31 L8 28 Z"
          fill={color}
          fillOpacity="0.15"
          stroke={color}
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        {/* Dedo índice extendido */}
        <path
          d="M16 13 L16 7 C16 5.3 14.7 4 13 4 C11.3 4 10 5.3 10 7 L10 22"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Punta del dedo */}
        <circle cx="13" cy="4" r="2.5" fill={color} fillOpacity="0.6"/>
      </g>
    </svg>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function Hero() {
  const navigate = useNavigate();
  const { c } = useTheme();

  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const check = () => {
      setIsTouchDevice(
        window.matchMedia("(hover: none) and (pointer: coarse)").matches
      );
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const accentColor = "rgba(168,85,247,0.75)";
  const labelColor  = "rgba(168,85,247,0.55)";

  return (
    <section
      className="relative text-center px-6 md:px-12 mx-auto"
      style={{ zIndex: 5, paddingTop: 72, paddingBottom: 100, maxWidth: 980 }}
    >
      <style>{SCROLL_CSS}</style>

      {/* Badge */}
      <div
        className="inline-flex items-center gap-2 rounded-full mb-8"
        style={{
          background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.2)",
          padding: "6px 16px", fontSize: 11, fontWeight: 600,
          letterSpacing: "0.12em", textTransform: "uppercase", color: "#a855f7",
        }}
      >
        <div className="badge-dot rounded-full" style={{ width: 6, height: 6, background: "#a855f7" }} />
        Disponibles para proyectos
      </div>

      {/* Título */}
      <h1
        style={{
          fontSize: "clamp(40px, 8vw, 72px)",
          fontWeight: 900, lineHeight: 1.05,
          letterSpacing: "clamp(-1px, -0.04em, -3px)",
          color: c.textHi, marginBottom: 10,
          fontFamily: "'Outfit', sans-serif",
        }}
      >
        Creamos soluciones
        <br />
        <span style={{ background: "linear-gradient(135deg,#a855f7 0%,#06b6d4 50%,#ec4899 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
          que trascienden
        </span>
        <br />
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "clamp(26px, 5.5vw, 58px)",
            letterSpacing: -2, display: "block", marginTop: 4,
            background: "linear-gradient(135deg, #06b6d4 0%, #a855f7 45%, #ec4899 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            filter: "drop-shadow(0 0 18px rgba(168,85,247,0.35))",
          }}
        >
          {"// sin límites"}
        </span>
      </h1>

      {/* Subtítulo */}
      <p style={{ fontSize: "clamp(15px, 2vw, 19px)", color: c.textMid, maxWidth: 560, margin: "24px auto 40px", lineHeight: 1.65 }}>
        Web, mobile, IA, automatización, diseño. Si tienes un problema, nosotros construimos la solución.
      </p>

      {/* Botones */}
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <button
          onClick={() => navigate("/contacto")}
          className="border-none text-white font-bold cursor-pointer"
          style={{ background: "linear-gradient(135deg,#7c3aed,#a855f7)", padding: "13px 32px", borderRadius: 12, fontSize: "clamp(14px, 2vw, 16px)", fontFamily: "'Outfit', sans-serif", transition: "all .25s", boxShadow: "0 4px 18px rgba(124,58,237,0.3)" }}
          onMouseEnter={(e) => { const b = e.currentTarget as HTMLButtonElement; b.style.transform = "translateY(-2px)"; b.style.boxShadow = "0 12px 30px rgba(124,58,237,0.5)"; }}
          onMouseLeave={(e) => { const b = e.currentTarget as HTMLButtonElement; b.style.transform = ""; b.style.boxShadow = "0 4px 18px rgba(124,58,237,0.3)"; }}
        >
          Hablemos
        </button>
        <button
          onClick={() => { const el = document.getElementById("equipo"); if (el) el.scrollIntoView({ behavior: "smooth" }); }}
          className="cursor-pointer font-medium"
          style={{ background: "transparent", color: c.textMid, border: `1px solid ${c.border}`, padding: "13px 24px", borderRadius: 12, fontSize: "clamp(14px, 2vw, 16px)", fontFamily: "'Outfit', sans-serif", transition: "all .25s" }}
          onMouseEnter={(e) => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = "rgba(168,85,247,0.4)"; b.style.color = "#a855f7"; }}
          onMouseLeave={(e) => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = c.border; b.style.color = c.textMid; }}
        >
          Conoce al equipo →
        </button>
      </div>

      {/* ── Indicador de scroll adaptativo ────────────────────────────────────
          Desktop (hover:hover / pointer:fine) → ícono de mouse
          Mobile  (hover:none  / pointer:coarse) → ícono de dedo deslizando
      ── */}
      <div
        className="scroll-indicator-wrap"
        style={{
          marginTop: 52,          // ← más separado de los botones (antes era 32px)
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          pointerEvents: "none",
        }}
      >
        {isTouchDevice
          ? <FingerIcon color={accentColor} />
          : <MouseIcon  color={accentColor} />
        }
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 9, fontWeight: 600,
            letterSpacing: "0.18em", textTransform: "uppercase",
            color: labelColor,
          }}
        >
          {isTouchDevice ? "desliza" : "scroll"}
        </span>
      </div>
    </section>
  );
}