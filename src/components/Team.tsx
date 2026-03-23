import { TEAM } from "../data";

export default function Team() {
  return (
    <section id="equipo" className="relative px-6 md:px-12 py-16 md:py-20 mx-auto" style={{ zIndex: 5, maxWidth: 1100 }}>
      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#a855f7", marginBottom: 12 }}>
        El equipo
      </p>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4" style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: "clamp(32px, 5vw, 44px)", fontWeight: 800, letterSpacing: -1.5, color: "#f1f0ff", lineHeight: 1.1 }}>
          Las mentes<br />detrás del código
        </h2>
        <p style={{ fontSize: 16, color: "rgba(241,240,255,0.55)", maxWidth: 380, lineHeight: 1.6 }}>
          Un equipo multidisciplinario apasionado por resolver problemas complejos con elegancia.
        </p>
      </div>

      <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
        {TEAM.map((m) => (
          <div
            key={m.initials}
            className="team-card rounded-2xl text-center cursor-pointer"
            style={{ background: "#0e0e1a", border: "1px solid rgba(255,255,255,0.05)", padding: "32px 24px" }}
          >
            <div
              className="flex items-center justify-center rounded-full mx-auto mb-4 font-black"
              style={{ width: 72, height: 72, fontSize: 24, background: `linear-gradient(135deg,${m.avatarFrom},${m.avatarTo})`, color: m.avatarText }}
            >
              {m.initials}
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: "#f1f0ff", marginBottom: 4 }}>{m.name}</h3>
            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: m.roleColor, marginBottom: 12 }}>
              {m.role}
            </p>
            <p style={{ fontSize: 13, color: "rgba(241,240,255,0.55)", lineHeight: 1.6 }}>{m.bio}</p>
            <div className="flex flex-wrap justify-center gap-1.5 mt-4">
              {m.skills.map((sk) => (
                <span key={sk} style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 100, letterSpacing: "0.05em", background: "rgba(255,255,255,0.05)", color: "rgba(241,240,255,0.4)", textTransform: "uppercase" }}>
                  {sk}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}