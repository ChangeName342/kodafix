export default function Hero() {
  return (
    <section
      className="relative text-center px-6 md:px-12 mx-auto"
      style={{ zIndex: 5, paddingTop: 72, paddingBottom: 52, maxWidth: 980 }}
    >
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

      <h1
        style={{
          fontSize: "clamp(40px, 8vw, 72px)",
          fontWeight: 900, lineHeight: 1.05,
          letterSpacing: "clamp(-1px, -0.04em, -3px)",
          color: "#f1f0ff", marginBottom: 10,
          fontFamily: "'Outfit', sans-serif",
        }}
      >
        Creamos soluciones
        <br />
        <span
          style={{
            background: "linear-gradient(135deg,#a855f7 0%,#06b6d4 50%,#ec4899 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}
        >
          que trascienden
        </span>
        <br />
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "clamp(28px, 6vw, 60px)",
            letterSpacing: -2, color: "rgba(168,85,247,0.4)", display: "block", marginTop: 4,
          }}
        >
          {"// todo tipo"}
        </span>
      </h1>

      <p style={{ fontSize: "clamp(15px, 2vw, 19px)", color: "rgba(241,240,255,0.55)", maxWidth: 560, margin: "24px auto 40px", lineHeight: 1.65 }}>
        Web, mobile, IA, automatización, diseño. Si tienes un problema, nosotros construimos la solución.
      </p>

      <div className="flex items-center justify-center gap-3 flex-wrap">
        <button
          className="border-none text-white font-bold cursor-pointer"
          style={{
            background: "linear-gradient(135deg,#7c3aed,#a855f7)",
            padding: "13px 28px", borderRadius: 12, fontSize: "clamp(14px, 2vw, 16px)",
            fontFamily: "'Outfit', sans-serif", transition: "all .25s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 12px 30px rgba(124,58,237,0.5)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "";
          }}
        >
          Ver proyectos
        </button>
        <button
          className="cursor-pointer font-medium"
          style={{
            background: "transparent", color: "rgba(241,240,255,0.6)",
            border: "1px solid rgba(255,255,255,0.1)",
            padding: "13px 24px", borderRadius: 12, fontSize: "clamp(14px, 2vw, 16px)",
            fontFamily: "'Outfit', sans-serif", transition: "all .25s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(168,85,247,0.4)";
            (e.currentTarget as HTMLButtonElement).style.color = "#a855f7";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.1)";
            (e.currentTarget as HTMLButtonElement).style.color = "rgba(241,240,255,0.6)";
          }}
        >
          Conoce al equipo →
        </button>
      </div>
    </section>
  );
}