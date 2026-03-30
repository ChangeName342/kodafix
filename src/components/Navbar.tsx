import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import LogoIcon from "./LogoIcon";
import { NAV_LINKS } from "../data";

const ANIMATION_CSS = `
  .logo-wrap {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    user-select: none;
  }

  .logo-icon-box {
    width: 50px;
    height: 50px;
    transition: transform 0.3s ease, filter 0.3s ease;
  }

  .logo-wrap:hover .logo-icon-box {
    filter: drop-shadow(0 0 8px #a855f760);
    transform: scale(1.05);
  }

  .logo-icon-box.animating {
    animation: logoSpin 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }

  @keyframes logoSpin {
    0% { transform: scale(1) rotate(0deg); }
    50% { transform: scale(1.15) rotate(5deg); }
    100% { transform: scale(1) rotate(0deg); }
  }

  .nav-link {
    transition: color .2s, background .2s;
  }

  .nav-link:hover {
    color: #fff !important;
    background: rgba(168,85,247,0.1) !important;
  }

  .mobile-menu {
    animation: fadeDown .2s ease;
  }

  @keyframes fadeDown {
    from { opacity: 0; transform: translateY(-8px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [navOpacity, setNavOpacity] = useState(1);

  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  const navigate = useNavigate();

  // Animación logo inicial
  useEffect(() => {
    const first = setTimeout(() => triggerAnimation(), 2000);
    return () => clearTimeout(first);
  }, []);

  const triggerAnimation = () => {
    setAnimating(true);
    setTimeout(() => setAnimating(false), 1200);
  };

  // Fade scroll
  useEffect(() => {
    const handleScroll = () => {
      if (ticking.current) return;
      ticking.current = true;

      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const delta = currentY - lastScrollY.current;

        if (currentY < 60) {
          setNavOpacity(1);
        } else if (delta > 0) {
          setNavOpacity((prev) => Math.max(0, prev - delta * 0.025));
        } else {
          setNavOpacity((prev) => Math.min(1, prev + Math.abs(delta) * 0.05));
        }

        lastScrollY.current = currentY;
        ticking.current = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNav = (href: string) => {
    if (href.startsWith("#")) {
      const el = document.getElementById(href.slice(1));
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(href);
    }
    setMenuOpen(false);
  };

  const publicLinks = NAV_LINKS.filter(
    (l) => !["Iniciar Sesión", "Login", "Acceder"].includes(l.label)
  );

  return (
    <>
      <style>{ANIMATION_CSS}</style>

      <nav
        className="relative flex items-center justify-between px-6 md:px-12 py-5"
        style={{
          zIndex: 100,
          borderBottom: "1px solid rgba(168,85,247,0.12)",
          opacity: navOpacity,
          pointerEvents: navOpacity < 0.05 ? "none" : "auto",
          transition: "opacity 0.12s linear",
          position: "sticky",
          top: 0,

          // 🔥 CLAVE: NO romper fondo
          background: "transparent",
          backdropFilter: "none",

          // 💡 OPCIONAL (descomenta si quieres glass al hacer scroll)
          /*
          background: navOpacity < 0.95 
            ? "transparent" 
            : "rgba(7,7,16,0.6)",
          backdropFilter: navOpacity < 0.95 
            ? "none" 
            : "blur(10px)",
          */
        }}
      >
        {/* Logo */}
        <div
          className="logo-wrap"
          onClick={() => {
            navigate("/");
            if (!animating) triggerAnimation();
          }}
        >
          <div className={`logo-icon-box ${animating ? "animating" : ""}`}>
            <LogoIcon />
          </div>

          {/* Tamaño del primer navbar */}
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 17,
              fontWeight: 700,
              letterSpacing: -0.5,
            }}
          >
            <span style={{ color: "#a855f7" }}>Koda</span>{" "}
            <span style={{ color: "#f1f0ff" }}>Fix</span>
          </span>
        </div>

        {/* Links desktop */}
        <ul className="hidden md:flex gap-1 list-none">
          {publicLinks.map((l) => (
            <li key={l.label}>
              <button
                onClick={() => handleNav(l.href)}
                className="nav-link block px-3 py-2 rounded-lg text-[13px] font-medium"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "rgba(241,240,255,0.55)",
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <button
          className="hidden md:block border-none text-white font-bold cursor-pointer"
          style={{
            background: "linear-gradient(135deg,#7c3aed,#9333ea)",
            padding: "9px 22px",
            borderRadius: 9,
            fontSize: 13,
            fontFamily: "'Outfit', sans-serif",
            transition: "all .2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow =
              "0 8px 25px rgba(124,58,237,0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "";
            e.currentTarget.style.boxShadow = "";
          }}
          onClick={() => handleNav("/contacto")}
        >
          Hablemos
        </button>

        {/* Mobile */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 cursor-pointer border-none bg-transparent"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="w-[22px] h-[2px] bg-white" />
          <span className="w-[22px] h-[2px] bg-white" />
          <span className="w-[22px] h-[2px] bg-white" />
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="mobile-menu md:hidden flex flex-col px-6 py-4 gap-1"
          style={{
            background: "#0e0e1a",
            borderBottom: "1px solid rgba(168,85,247,0.12)",
          }}
        >
          {publicLinks.map((l) => (
            <button
              key={l.label}
              onClick={() => handleNav(l.href)}
              className="nav-link px-3 py-3 rounded-lg text-[14px] text-left"
              style={{
                color: "rgba(241,240,255,0.65)",
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              {l.label}
            </button>
          ))}

          <button
            className="mt-3 text-white font-bold w-full"
            style={{
              background: "linear-gradient(135deg,#7c3aed,#9333ea)",
              padding: "12px",
              borderRadius: 9,
              fontSize: 14,
            }}
            onClick={() => handleNav("/contacto")}
          >
            Hablemos
          </button>
        </div>
      )}
    </>
  );
}

