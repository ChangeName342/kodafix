import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoIcon from "./LogoIcon";
import { NAV_LINKS } from "../data";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <nav
        className="relative flex items-center justify-between px-6 md:px-12 py-5"
        style={{ zIndex: 100, borderBottom: "1px solid rgba(168,85,247,0.12)" }}
      >
        <div className="flex items-center gap-3">
          <LogoIcon />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 17, fontWeight: 700, color: "#a855f7", letterSpacing: -0.5 }}>
            Koda<span style={{ color: "#f1f0ff" }}>Fix</span>
          </span>
        </div>

        {/* Desktop links */}
        <ul className="hidden md:flex gap-1 list-none">
          {NAV_LINKS.map((l) => (
            <li key={l.label}>
              <button
                onClick={() => navigate(l.href)}
                className="nav-link block px-3 py-2 rounded-lg text-[13px] font-medium"
                style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(241,240,255,0.55)", fontFamily: "'Outfit', sans-serif" }}
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <button
          className="hidden md:block border-none text-white font-bold cursor-pointer"
          style={{
            background: "linear-gradient(135deg,#7c3aed,#9333ea)",
            padding: "9px 22px", borderRadius: 9, fontSize: 13,
            fontFamily: "'Outfit', sans-serif", transition: "all .2s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 25px rgba(124,58,237,0.4)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "";
          }}
        >
          Hablemos
        </button>

        {/* Hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 cursor-pointer border-none bg-transparent"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menú"
        >
          <span style={{ display: "block", width: 22, height: 2, background: menuOpen ? "#a855f7" : "rgba(241,240,255,0.6)", borderRadius: 2, transition: "all .2s", transform: menuOpen ? "rotate(45deg) translate(3px, 3px)" : "" }} />
          <span style={{ display: "block", width: 22, height: 2, background: menuOpen ? "#a855f7" : "rgba(241,240,255,0.6)", borderRadius: 2, transition: "all .2s", opacity: menuOpen ? 0 : 1 }} />
          <span style={{ display: "block", width: 22, height: 2, background: menuOpen ? "#a855f7" : "rgba(241,240,255,0.6)", borderRadius: 2, transition: "all .2s", transform: menuOpen ? "rotate(-45deg) translate(3px, -3px)" : "" }} />
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="mobile-menu md:hidden relative flex flex-col px-6 py-4 gap-1"
          style={{ zIndex: 99, background: "#0e0e1a", borderBottom: "1px solid rgba(168,85,247,0.12)" }}
        >
          {NAV_LINKS.map((l) => (
            <button
              key={l.label}
              onClick={() => { navigate(l.href); setMenuOpen(false); }}
              className="nav-link px-3 py-3 rounded-lg text-[14px] font-medium text-left w-full"
              style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(241,240,255,0.65)", fontFamily: "'Outfit', sans-serif" }}
            >
              {l.label}
            </button>
          ))}
          <button
            className="mt-3 border-none text-white font-bold cursor-pointer w-full"
            style={{
              background: "linear-gradient(135deg,#7c3aed,#9333ea)",
              padding: "12px", borderRadius: 9, fontSize: 14,
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            Hablemos
          </button>
        </div>
      )}
    </>
  );
}

