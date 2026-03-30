import { useNavigate } from "react-router-dom";
import { TEAM } from "../data";

const SKILLS_ICONS: Record<string, string> = {
  React: "⚛️", "Node.js": "🟩", Firebase: "🔥", TypeScript: "💙",
  Python: "🐍", Cloud: "☁️", DevOps: "⚙️", SQL: "🗄️",
  Vue: "💚", CSS: "🎨", Figma: "🖼️", Motion: "✨",
};

// Datos extendidos por miembro (bio larga + logros)
const TEAM_EXTRA: Record<string, { tagline: string; logros: string[] }> = {
  KC: {
    tagline: "Arquitecto de experiencias digitales que trascienden.",
    logros: [
      "Más de 40 proyectos web entregados a tiempo",
      "Especialista en SaaS, e-commerce y sistemas a medida",
      "Apasionado por el código limpio y el rendimiento al máximo",
      "Lidera la visión técnica y estratégica de Koda Fix",
    ],
  },
  NL: {
    tagline: "El que hace que todo funcione sin importar la presión.",
    logros: [
      "Experto en arquitecturas de backend escalables",
      "Automatiza procesos que antes tomaban horas",
      "Infraestructura cloud lista para cualquier escala",
      "Construye los cimientos que nunca se ven pero siempre se sienten",
    ],
  },
  IB: {
    tagline: "Transforma pixels en experiencias que se recuerdan.",
    logros: [
      "Frontend con ojo clínico para el detalle visual",
      "Dominio de animaciones e interfaces interactivas",
      "Puente entre diseño y código de producción",
      "Crea interfaces que los usuarios adoran usar",
    ],
  },
};

export default function Equipo() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#070710",
        fontFamily: "'Outfit', sans-serif",
        color: "#f1f0ff",
        overflowX: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;700&display=swap');
        @keyframes auroraDrift {
          0%,100% { transform:translateX(-50%) translateY(0) scale(1); }
          33%      { transform:translateX(-50%) translateY(16px) scale(1.05); }
          66%      { transform:translateX(-50%) translateY(-10px) scale(0.97); }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(24px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .card-member {
          background: #0d0d1a;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 20px;
          overflow: hidden;
          transition: transform .3s ease, border-color .3s ease, box-shadow .3s ease;
          animation: fadeUp 0.5s ease both;
        }
        .card-member:hover {
          transform: translateY(-5px);
          border-color: rgba(168,85,247,0.22);
          box-shadow: 0 20px 50px rgba(0,0,0,0.45), 0 0 0 1px rgba(168,85,247,0.1);
        }
        .skill-tag {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 10px; font-weight: 600;
          letter-spacing: 0.06em; text-transform: uppercase;
          padding: 4px 10px; border-radius: 100px;
          background: rgba(255,255,255,0.05);
          color: rgba(241,240,255,0.45);
          border: 1px solid rgba(255,255,255,0.07);
        }
        .logro-item {
          display: flex; align-items: flex-start; gap: 10px;
          font-size: 13.5px; color: rgba(241,240,255,0.65); line-height: 1.55;
        }
        .nav-back { transition: color .2s; }
        .nav-back:hover { color: #a855f7 !important; }
      `}</style>

      {/* Aurora */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed", top: 0, left: "50%",
          width: 900, height: 600, zIndex: 0, pointerEvents: "none",
          animation: "auroraDrift 18s ease-in-out infinite",
        }}
      >
        <div style={{ position: "absolute", top: -60, left: "15%", width: 520, height: 380, borderRadius: "50%", background: "radial-gradient(ellipse,rgba(109,40,217,0.20) 0%,transparent 72%)", filter: "blur(32px)" }} />
        <div style={{ position: "absolute", top: 40,  left: "40%", width: 440, height: 300, borderRadius: "50%", background: "radial-gradient(ellipse,rgba(14,62,145,0.16) 0%,transparent 70%)",  filter: "blur(40px)" }} />
      </div>

      {/* Navbar mínimo */}
      <nav
        style={{
          position: "sticky", top: 0, zIndex: 100,
          borderBottom: "1px solid rgba(168,85,247,0.12)",
          background: "rgba(7,7,16,0.88)",
          backdropFilter: "blur(14px)",
          padding: "16px 32px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}
      >
        <button
          onClick={() => navigate("/")}
          className="nav-back"
          style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 8,
            color: "rgba(241,240,255,0.5)",
            fontFamily: "'Outfit', sans-serif", fontSize: 14,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Volver al inicio
        </button>

        <span
          onClick={() => navigate("/")}
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 17, fontWeight: 700, cursor: "pointer",
          }}
        >
          <span style={{ color: "#a855f7" }}>Koda </span>
          <span style={{ color: "#f1f0ff" }}>Fix</span>
        </span>

        <button
          onClick={() => navigate("/contacto")}
          style={{
            background: "linear-gradient(135deg,#7c3aed,#9333ea)",
            border: "none", color: "#fff", fontWeight: 700,
            padding: "9px 22px", borderRadius: 9, fontSize: 14,
            fontFamily: "'Outfit', sans-serif", cursor: "pointer",
          }}
        >
          Hablemos
        </button>
      </nav>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "64px 24px 96px", position: "relative", zIndex: 1 }}>

        {/* Encabezado */}
        <div style={{ marginBottom: 64 }}>
          <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#a855f7", marginBottom: 14 }}>
            El equipo
          </p>
          <h1
            style={{
              fontSize: "clamp(32px,6vw,52px)", fontWeight: 900,
              letterSpacing: -2, lineHeight: 1.06, margin: "0 0 18px",
            }}
          >
            Las mentes
            <br />
            <span
              style={{
                background: "linear-gradient(135deg,#a855f7 0%,#06b6d4 50%,#ec4899 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}
            >
              detrás del código
            </span>
          </h1>
          <p style={{ fontSize: 17, color: "rgba(241,240,255,0.5)", maxWidth: 520, lineHeight: 1.7 }}>
            Un equipo multidisciplinario apasionado por resolver problemas complejos con elegancia y código que dura.
          </p>
        </div>

        {/* Cards del equipo */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 24,
          }}
        >
          {TEAM.map((m, i) => {
            const extra = TEAM_EXTRA[m.initials] ?? { tagline: "", logros: [] };
            return (
              <div
                key={m.initials}
                className="card-member"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {/* Franja superior con gradiente del avatar */}
                <div
                  style={{
                    height: 6,
                    background: `linear-gradient(90deg, ${m.avatarFrom}, ${m.avatarTo})`,
                  }}
                />

                <div style={{ padding: "32px 28px 28px" }}>

                  {/* Avatar + nombre + rol */}
                  <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 20 }}>
                    <div
                      style={{
                        width: 72, height: 72, flexShrink: 0,
                        borderRadius: "50%",
                        background: `linear-gradient(135deg,${m.avatarFrom},${m.avatarTo})`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 24, fontWeight: 900, color: m.avatarText,
                        boxShadow: `0 4px 20px ${m.avatarTo}50`,
                      }}
                    >
                      {m.initials}
                    </div>
                    <div>
                      <h2 style={{ fontSize: 18, fontWeight: 800, color: "#f1f0ff", letterSpacing: -0.4, margin: "0 0 4px" }}>
                        {m.name}
                      </h2>
                      <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: m.roleColor, margin: 0 }}>
                        {m.role}
                      </p>
                    </div>
                  </div>

                  {/* Tagline */}
                  <p
                    style={{
                      fontSize: 14, fontStyle: "italic",
                      color: m.roleColor,
                      marginBottom: 14, lineHeight: 1.5,
                      borderLeft: `2px solid ${m.roleColor}50`,
                      paddingLeft: 12,
                    }}
                  >
                    "{extra.tagline}"
                  </p>

                  {/* Bio */}
                  <p style={{ fontSize: 13.5, color: "rgba(241,240,255,0.55)", lineHeight: 1.7, marginBottom: 22 }}>
                    {m.bio}
                  </p>

                  {/* Logros */}
                  <div style={{ marginBottom: 22 }}>
                    <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(241,240,255,0.28)", marginBottom: 12 }}>
                      Destacados
                    </p>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 9 }}>
                      {extra.logros.map((l, j) => (
                        <li key={j} className="logro-item">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={m.roleColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          {l}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Skills */}
                  <div>
                    <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(241,240,255,0.28)", marginBottom: 10 }}>
                      Stack
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {m.skills.map((sk) => (
                        <span key={sk} className="skill-tag">
                          <span style={{ fontSize: 11 }}>{SKILLS_ICONS[sk] ?? "🔧"}</span>
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* CTA al final */}
        <div
          style={{
            marginTop: 72, textAlign: "center",
            background: "linear-gradient(135deg,rgba(124,58,237,0.08),rgba(168,85,247,0.04))",
            border: "1px solid rgba(168,85,247,0.18)",
            borderRadius: 20, padding: "44px 32px",
          }}
        >
          <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#a855f7", marginBottom: 14 }}>
            ¿Quieres trabajar con nosotros?
          </p>
          <h2 style={{ fontSize: "clamp(22px,4vw,34px)", fontWeight: 900, letterSpacing: -1, marginBottom: 14 }}>
            Construyamos algo juntos
          </h2>
          <p style={{ fontSize: 15, color: "rgba(241,240,255,0.5)", maxWidth: 420, margin: "0 auto 28px", lineHeight: 1.7 }}>
            Cuéntanos tu proyecto y te responderemos en menos de 24 horas.
          </p>
          <button
            onClick={() => navigate("/contacto")}
            style={{
              background: "linear-gradient(135deg,#7c3aed,#a855f7)",
              border: "none", color: "#fff", fontWeight: 700,
              padding: "14px 36px", borderRadius: 12,
              fontFamily: "'Outfit',sans-serif", fontSize: 16,
              cursor: "pointer",
              boxShadow: "0 8px 28px rgba(124,58,237,0.4)",
            }}
          >
            Hablemos →
          </button>
        </div>

      </div>
    </div>
  );
}
