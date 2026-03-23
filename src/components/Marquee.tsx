import { MARQUEE_ITEMS } from "../data";

export default function Marquee() {
  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div
      className="relative overflow-hidden"
      style={{
        zIndex: 5,
        borderTop: "1px solid rgba(168,85,247,0.08)",
        borderBottom: "1px solid rgba(168,85,247,0.08)",
        padding: "14px 0", margin: "32px 0",
      }}
    >
      <div className="marquee-track flex gap-0" style={{ width: "max-content" }}>
        {doubled.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-2 whitespace-nowrap"
            style={{ padding: "0 24px", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}
          >
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: item.color }} />
            <span style={{ color: item.color + "88" }}>{item.txt}</span>
          </div>
        ))}
      </div>
    </div>
  );
}