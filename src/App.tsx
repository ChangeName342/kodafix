import ParticleCanvas from "./components/ParticleCanvas";
import Navbar        from "./components/Navbar";
import Hero          from "./components/Hero";
import Marquee       from "./components/Marquee";
import Services      from "./components/Services";
import Stats         from "./components/Stats";
import Team          from "./components/Team";
import Footer        from "./components/Footer";

export default function App() {
  return (
    <div
      className="min-h-screen text-white overflow-x-hidden"
      style={{ background: "#070710", fontFamily: "'Outfit', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; }
        @keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        @keyframes blink {
          0%,100% { opacity:1; box-shadow: 0 0 0 0 rgba(168,85,247,.4); }
          50%      { opacity:.5; box-shadow: 0 0 0 6px rgba(168,85,247,0); }
        }
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .marquee-track  { animation: marquee 22s linear infinite; }
        .badge-dot      { animation: blink 2s ease-in-out infinite; }
        .service-card   { transition: transform .3s, border-color .3s; }
        .service-card:hover { transform: translateY(-4px); border-color: rgba(168,85,247,0.2) !important; }
        .team-card      { transition: transform .3s, border-color .3s; }
        .team-card:hover { transform: translateY(-4px); border-color: rgba(168,85,247,0.2) !important; }
        .nav-link       { transition: color .2s, background .2s; }
        .nav-link:hover { color: #fff !important; background: rgba(168,85,247,0.1) !important; }
        .mobile-menu    { animation: fadeDown .2s ease; }
      `}</style>

      <ParticleCanvas />

      {/* Glow de fondo */}
      <div
        className="fixed pointer-events-none"
        style={{
          top: -200, left: "50%", transform: "translateX(-50%)",
          width: 700, height: 500, zIndex: 1,
          background: "radial-gradient(ellipse, rgba(109,40,217,0.18) 0%, transparent 70%)",
        }}
      />

      <Navbar />
      <Hero />
      <Marquee />
      <Services />
      <Stats />
      <Team />
      <Footer />
    </div>
  );
}

