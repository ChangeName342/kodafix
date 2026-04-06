import { useTheme } from "../context/ThemeContext";

const SERVICES = [
  {
    title: "Desarrollo Web",
    desc: "Aplicaciones rápidas, escalables y hermosas. Desde landing pages hasta plataformas SaaS completas.",
    bg: "rgba(124,58,237,0.08)", iconBg: "rgba(124,58,237,0.15)",
    tags: ["React", "Next.js", "TypeScript"], tagColor: "#c084fc", tagBg: "rgba(124,58,237,0.12)",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></svg>,
  },
  {
    title: "Apps Mobile",
    desc: "iOS y Android nativos o cross-platform. Experiencias móviles que los usuarios adoran usar.",
    bg: "rgba(6,182,212,0.08)", iconBg: "rgba(6,182,212,0.12)",
    tags: ["React Native", "Flutter"], tagColor: "#22d3ee", tagBg: "rgba(6,182,212,0.1)",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round"><rect x="5" y="2" width="14" height="20" rx="2" /><path d="M12 18h.01" /></svg>,
  },
  {
    title: "Inteligencia Artificial",
    desc: "Chatbots, modelos personalizados, automatización inteligente y soluciones de visión computacional.",
    bg: "rgba(236,72,153,0.08)", iconBg: "rgba(236,72,153,0.12)",
    tags: ["LLMs", "Python", "ML"], tagColor: "#f472b6", tagBg: "rgba(236,72,153,0.1)",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" /><path d="M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" /></svg>,
  },
  {
    title: "Datos & Analítica",
    desc: "Dashboards, pipelines de datos, visualizaciones y sistemas de reportería que te ayudan a decidir mejor.",
    bg: "rgba(249,115,22,0.08)", iconBg: "rgba(249,115,22,0.12)",
    tags: ["SQL", "BigQuery", "Tableau"], tagColor: "#fb923c", tagBg: "rgba(249,115,22,0.1)",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /></svg>,
  },
  {
    title: "Diseño UI/UX",
    desc: "Interfaces que enamoran. Investigación de usuarios, prototipado, sistemas de diseño y entrega lista para código.",
    bg: "rgba(16,185,129,0.08)", iconBg: "rgba(16,185,129,0.12)",
    tags: ["Figma", "UX Research"], tagColor: "#34d399", tagBg: "rgba(16,185,129,0.1)",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5M2 12l10 5 10-5" /></svg>,
  },
  {
    title: "Cloud & DevOps",
    desc: "Infraestructura como código, CI/CD, contenedores y despliegues que no fallan a las 3 AM.",
    bg: "rgba(234,179,8,0.08)", iconBg: "rgba(234,179,8,0.12)",
    tags: ["AWS", "Docker", "Firebase"], tagColor: "#facc15", tagBg: "rgba(234,179,8,0.1)",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="2" strokeLinecap="round"><rect x="2" y="2" width="20" height="8" rx="2" /><rect x="2" y="14" width="20" height="8" rx="2" /><line x1="6" y1="6" x2="6.01" y2="6" /><line x1="6" y1="18" x2="6.01" y2="18" /></svg>,
  },
];

export default function Services() {
  const { c } = useTheme();

  return (
    <section id="servicios" className="relative px-6 md:px-12 py-16 md:py-20 mx-auto" style={{ zIndex: 5, maxWidth: 1100 }}>
      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#a855f7", marginBottom: 12 }}>
        Lo que hacemos
      </p>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4" style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: "clamp(32px, 5vw, 44px)", fontWeight: 800, letterSpacing: -1.5, color: c.textHi, lineHeight: 1.1 }}>
          Soluciones para<br />cada desafío
        </h2>
        <p style={{ fontSize: 16, color: c.textMid, maxWidth: 500, lineHeight: 1.6 }}>
          Desde apps web hasta modelos de IA, pasando por infraestructura y diseño de producto.
        </p>
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
        {SERVICES.map((s) => (
          <div
            key={s.title}
            className="service-card rounded-2xl p-6 relative overflow-hidden cursor-pointer"
            style={{ background: c.bgCard, border: `1px solid ${c.border}` }}
          >
            <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ background: `linear-gradient(135deg,${s.bg},transparent)` }} />
            <div className="flex items-center justify-center rounded-xl mb-5" style={{ width: 44, height: 44, background: s.iconBg, position: "relative" }}>
              {s.icon}
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: c.textHi, marginBottom: 8, letterSpacing: -0.3 }}>{s.title}</h3>
            <p style={{ fontSize: 13, color: c.textMid, lineHeight: 1.65 }}>{s.desc}</p>
            <div className="flex flex-wrap gap-1.5 mt-4">
              {s.tags.map((t) => (
                <span key={t} style={{ fontSize: 10, fontWeight: 600, padding: "3px 9px", borderRadius: 100, letterSpacing: "0.06em", textTransform: "uppercase", color: s.tagColor, background: s.tagBg }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
