import ParticleCanvas  from "./components/ParticleCanvas";
import Navbar          from "./components/Navbar";
import Hero            from "./components/Hero";
import Marquee         from "./components/Marquee";
import Services        from "./components/Services";
import Stats           from "./components/Stats";
import Footer          from "./components/Footer";
import WhatsAppButton  from "./components/WhatsAppButton";
import PricingPlans    from "./components/PricingPlans";
import { useTheme }   from "./context/ThemeContext";

export default function App() {
  const { c } = useTheme();
  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ background: c.bg, color: c.textHi, fontFamily: "'Outfit', sans-serif", transition: "background 0.3s, color 0.3s" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; }
        @keyframes marquee  { from { transform: translateX(0) }   to { transform: translateX(-50%) } }
        @keyframes blink    {
          0%,100% { opacity:1; box-shadow: 0 0 0 0 rgba(168,85,247,.4); }
          50%     { opacity:.5; box-shadow: 0 0 0 6px rgba(168,85,247,0); }
        }
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes auroraDrift {
          0%, 100% { transform: translateX(-50%) translateY(0)    scale(1); }
          33%       { transform: translateX(-50%) translateY(18px)  scale(1.06); }
          66%       { transform: translateX(-50%) translateY(-12px) scale(0.96); }
        }
        .marquee-track  { animation: marquee 22s linear infinite; }
        .badge-dot      { animation: blink 2s ease-in-out infinite; }
        .service-card   { transition: transform .3s, border-color .3s; }
        .service-card:hover { transform: translateY(-4px); border-color: rgba(168,85,247,0.2) !important; }
        .nav-link       { transition: color .2s, background .2s; }
        .nav-link:hover { color: #fff !important; background: rgba(168,85,247,0.1) !important; }
        .mobile-menu    { animation: fadeDown .2s ease; }
      `}</style>

      <ParticleCanvas />

      {/* Aurora de fondo */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed", top: 0, left: "50%",
          width: 900, height: 600, zIndex: 1, pointerEvents: "none",
          transform: "translateX(-50%)",
          animation: "auroraDrift 18s ease-in-out infinite",
        }}
      >
        <div style={{ position: "absolute", top: -60, left: "15%", width: 520, height: 380, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(109,40,217,0.22) 0%, transparent 72%)", filter: "blur(32px)" }} />
        <div style={{ position: "absolute", top: 40,  left: "40%", width: 440, height: 300, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(14,62,145,0.18) 0%, transparent 70%)",  filter: "blur(40px)" }} />
        <div style={{ position: "absolute", top: 80,  left: "5%",  width: 280, height: 200, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(168,85,247,0.1) 0%, transparent 70%)",  filter: "blur(28px)" }} />
      </div>

      <div style={{ position: "fixed", top: -200, left: "50%", transform: "translateX(-50%)", width: 700, height: 500, zIndex: 1, pointerEvents: "none", background: "radial-gradient(ellipse, rgba(109,40,217,0.10) 0%, transparent 70%)" }} />

      {/* Fold completo */}
      <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", position: "relative", zIndex: 5 }}>
        <Navbar />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <Hero />
        </div>
        <Marquee />
      </div>

      {/* Contenido bajo el fold — Team eliminado de aquí */}
      <Services />
      <Stats />
      <PricingPlans />
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

