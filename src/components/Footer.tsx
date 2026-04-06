import { useTheme } from "../context/ThemeContext";

export default function Footer() {
  const { c } = useTheme();

  return (
    <footer
      className="relative text-center"
      style={{ zIndex: 5, padding: "36px 24px", borderTop: `1px solid ${c.border}`, color: c.textLow, fontSize: 13 }}
    >
      Hecho con <span style={{ color: "#a855f7" }}>♥</span> por{" "}
      <span style={{ color: "#a855f7" }}>Koda Fix</span> · 2026
    </footer>
  );
}
