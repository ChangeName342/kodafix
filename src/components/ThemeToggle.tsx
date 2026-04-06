import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { isDark, toggle } = useTheme();
  const [hov, setHov] = useState(false);
  const [pressed, setPressed] = useState(false);

  return (
    <button
      onClick={toggle}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => { setHov(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      style={{
        position: "fixed",
        bottom: 88,
        right: 22,
        zIndex: 9999,
        width: 48,
        height: 48,
        borderRadius: "50%",
        border: isDark
          ? "1px solid rgba(168,85,247,0.35)"
          : "1px solid rgba(168,85,247,0.45)",
        background: isDark
          ? hov
            ? "linear-gradient(135deg,#1a1030,#2d1a5a)"
            : "linear-gradient(135deg,#0f0e20,#1c1040)"
          : hov
            ? "linear-gradient(135deg,#e8e4ff,#d4cbff)"
            : "linear-gradient(135deg,#f0eeff,#e4dfff)",
        boxShadow: hov
          ? isDark
            ? "0 6px 28px rgba(168,85,247,0.45), 0 0 0 1px rgba(168,85,247,0.2)"
            : "0 6px 28px rgba(168,85,247,0.3), 0 0 0 1px rgba(168,85,247,0.2)"
          : isDark
            ? "0 4px 18px rgba(0,0,0,0.5)"
            : "0 4px 18px rgba(168,85,247,0.2)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: pressed ? "scale(0.9)" : hov ? "scale(1.1)" : "scale(1)",
        transition: "all 0.22s cubic-bezier(0.34,1.56,0.64,1)",
      }}
    >
      {/* Icono animado */}
      <span
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "transform 0.4s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s",
          transform: isDark ? "rotate(0deg)" : "rotate(180deg)",
        }}
      >
        {isDark ? (
          /* Luna */
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c084fc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        ) : (
          /* Sol */
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
        )}
      </span>

      {/* Tooltip */}
      {hov && (
        <span style={{
          position: "absolute",
          right: 56,
          background: isDark ? "#1c1040" : "#ffffff",
          border: `1px solid ${isDark ? "rgba(168,85,247,0.3)" : "rgba(168,85,247,0.25)"}`,
          borderRadius: 8,
          padding: "5px 10px",
          fontFamily: "'Outfit',sans-serif",
          fontSize: 12,
          fontWeight: 600,
          color: isDark ? "#c084fc" : "#7c3aed",
          whiteSpace: "nowrap",
          boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
          pointerEvents: "none",
          animation: "fadeIn .15s ease",
        }}>
          {isDark ? "Modo claro" : "Modo oscuro"}
        </span>
      )}
      <style>{`@keyframes fadeIn { from { opacity:0; transform:translateX(4px) } to { opacity:1; transform:translateX(0) } }`}</style>
    </button>
  );
}
