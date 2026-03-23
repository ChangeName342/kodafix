import { STATS } from "../data";

export default function Stats() {
  return (
    <div
      className="relative grid grid-cols-2 md:grid-cols-4"
      style={{ zIndex: 5, borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}
    >
      {STATS.map((s, i) => (
        <div
          key={s.label}
          className="text-center"
          style={{
            padding: "32px 20px",
            borderRight: i % 2 === 0 ? "1px solid rgba(255,255,255,0.04)" : undefined,
            borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.04)" : undefined,
          }}
        >
          <span
            className={`bg-gradient-to-r ${s.gradient} block`}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 700,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              backgroundClip: "text", marginBottom: 6,
            }}
          >
            {s.num}
          </span>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(241,240,255,0.25)" }}>
            {s.label}
          </span>
        </div>
      ))}
    </div>
  );
}