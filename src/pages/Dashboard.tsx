import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { logoutUser } from "../services/authService";
import SectionUsuarios from "../components/dashboard/SectionUsuarios";
import SectionPerfil from "../components/dashboard/SectionPerfil";
import SectionProyectosPersonales from "../components/dashboard/SectionProyectosPersonales";

// ── TIPOS ─────────────────────────────────────────────────────────────────────

type Section =
  | "inicio"
  | "usuarios"
  | "servicios"
  | "planes"
  | "proyectos-clientes"
  | "proyectos-personales"
  | "certificados"
  | "habilidades"
  | "perfil";

// ── ICONOS ────────────────────────────────────────────────────────────────────

const I = {
  home:     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  users:    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  service:  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>,
  plans:    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>,
  projCli:  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  projPer:  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
  cert:     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>,
  skills:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  profile:  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  logout:   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  plus:     <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
};

// ── SIDEBAR ───────────────────────────────────────────────────────────────────

type MenuItem = { id: Section; label: string; icon: React.ReactNode; color?: string };

function Sidebar({
  items, active, onSelect, displayName, email, roleLabel, avatarGradient, onLogout,
}: {
  items: MenuItem[]; active: Section; onSelect: (s: Section) => void;
  displayName: string; email: string; roleLabel: string;
  avatarGradient: string; onLogout: () => void;
}) {
  const initials = displayName.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <aside style={{ width: 240, background: "#0a0a14", borderRight: "1px solid rgba(255,255,255,0.05)", display: "flex", flexDirection: "column", flexShrink: 0, minHeight: "100vh" }}>
      {/* Logo */}
      <div style={{ padding: "24px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src="/logo.png" alt="KodaFix" style={{ width: 34, height: 34, objectFit: "contain" }} />
          <div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 15, fontWeight: 700, color: "#a855f7" }}>
              Koda<span style={{ color: "#f1f0ff" }}>Fix</span>
            </span>
            <div style={{ fontSize: 10, color: "rgba(241,240,255,0.3)", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 1 }}>{roleLabel}</div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 2 }}>
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "9px 12px", borderRadius: 8, width: "100%",
              background: active === item.id ? "rgba(168,85,247,0.12)" : "none",
              border: "none", cursor: "pointer",
              color: active === item.id ? (item.color ?? "#a855f7") : "rgba(241,240,255,0.4)",
              fontSize: 13, fontWeight: 500,
              fontFamily: "'Outfit', sans-serif",
              transition: "background .15s, color .15s",
              textAlign: "left",
            }}
            onMouseEnter={(e) => { if (active !== item.id) (e.currentTarget as HTMLButtonElement).style.background = "rgba(168,85,247,0.06)"; }}
            onMouseLeave={(e) => { if (active !== item.id) (e.currentTarget as HTMLButtonElement).style.background = "none"; }}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      {/* User */}
      <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 8, background: "rgba(255,255,255,0.03)" }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: avatarGradient, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
            {initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#f1f0ff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{displayName}</div>
            <div style={{ fontSize: 10, color: "rgba(241,240,255,0.3)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{email}</div>
          </div>
          <button onClick={onLogout} title="Cerrar sesión"
            style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(241,240,255,0.3)", padding: 4, transition: "color .2s" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#ef4444")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "rgba(241,240,255,0.3)")}
          >
            {I.logout}
          </button>
        </div>
      </div>
    </aside>
  );
}

// ── PLACEHOLDER ───────────────────────────────────────────────────────────────

function Placeholder({ title, description, buttonLabel, color = "#a855f7" }: {
  title: string; description: string; buttonLabel: string; color?: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 320, textAlign: "center", padding: 48 }}>
      <div style={{ width: 72, height: 72, borderRadius: 20, background: `${color}12`, border: `1px solid ${color}25`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, fontSize: 32 }}>
        🚧
      </div>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: "#f1f0ff", letterSpacing: -0.5, marginBottom: 10 }}>{title}</h2>
      <p style={{ fontSize: 14, color: "rgba(241,240,255,0.45)", maxWidth: 380, lineHeight: 1.7, marginBottom: 28 }}>{description}</p>
      <button style={{ background: `linear-gradient(135deg,${color}cc,${color})`, border: "none", color: "#fff", padding: "10px 24px", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit', sans-serif", opacity: 0.5 }} disabled>
        {buttonLabel} — próximamente
      </button>
    </div>
  );
}

// ── SECCIÓN INICIO ────────────────────────────────────────────────────────────

function SectionInicio({ displayName, isFounder }: { displayName: string; isFounder: boolean }) {
  const stats = isFounder
    ? [
        { label: "Usuarios",          value: "—", color: "#a855f7", bg: "rgba(168,85,247,0.08)", border: "rgba(168,85,247,0.15)" },
        { label: "Servicios",         value: "—", color: "#06b6d4", bg: "rgba(6,182,212,0.08)",  border: "rgba(6,182,212,0.15)" },
        { label: "Proyectos clientes",value: "—", color: "#10b981", bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.15)" },
        { label: "Planes activos",    value: "—", color: "#f97316", bg: "rgba(249,115,22,0.08)", border: "rgba(249,115,22,0.15)" },
      ]
    : [
        { label: "Mis proyectos",  value: "—", color: "#06b6d4", bg: "rgba(6,182,212,0.08)",  border: "rgba(6,182,212,0.15)" },
        { label: "Certificados",   value: "—", color: "#a855f7", bg: "rgba(168,85,247,0.08)", border: "rgba(168,85,247,0.15)" },
        { label: "Habilidades",    value: "—", color: "#10b981", bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.15)" },
        { label: "Disponibles",    value: "—", color: "#f97316", bg: "rgba(249,115,22,0.08)", border: "rgba(249,115,22,0.15)" },
      ];

  return (
    <div>
      {/* Badge rol */}
      <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: isFounder ? "rgba(168,85,247,0.08)" : "rgba(6,182,212,0.08)", border: `1px solid ${isFounder ? "rgba(168,85,247,0.25)" : "rgba(6,182,212,0.25)"}`, borderRadius: 100, padding: "5px 14px", marginBottom: 24 }}>
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: isFounder ? "#a855f7" : "#06b6d4" }} />
        <span style={{ fontSize: 11, fontWeight: 700, color: isFounder ? "#a855f7" : "#06b6d4", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Rol activo: {isFounder ? "Fundador" : "Administrador"} ✓
        </span>
      </div>

      <h1 style={{ fontSize: 26, fontWeight: 800, color: "#f1f0ff", letterSpacing: -0.5, marginBottom: 6 }}>
        Bienvenido, {displayName.split(" ")[0]} 👋
      </h1>
      <p style={{ fontSize: 14, color: "rgba(241,240,255,0.4)", marginBottom: 32 }}>
        {isFounder
          ? "Tienes acceso completo: usuarios, servicios, planes y proyectos."
          : "Gestiona tus proyectos, certificados y habilidades."}
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 32 }}>
        {stats.map((s) => (
          <div key={s.label} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 14, padding: "20px 20px" }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: s.color, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1, marginBottom: 8 }}>{s.value}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(241,240,255,0.5)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Info de secciones disponibles */}
      <div style={{ background: "#0e0e1a", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 16, padding: 24 }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: "#f1f0ff", marginBottom: 16 }}>
          Secciones disponibles
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {(isFounder
            ? [
                { label: "Usuarios",             desc: "Crear, editar y eliminar usuarios del sistema",              color: "#a855f7" },
                { label: "Servicios",            desc: "Administrar los servicios que ofrece KodaFix",              color: "#06b6d4" },
                { label: "Planes",               desc: "Gestionar planes y sus detalles de precios",                color: "#10b981" },
                { label: "Proyectos clientes",   desc: "Subir y gestionar proyectos solicitados por clientes",      color: "#f97316" },
                { label: "Proyectos personales", desc: "Proyectos propios que deseas mostrar en tu portafolio",     color: "#ec4899" },
                { label: "Certificados",         desc: "Agregar y gestionar tus certificaciones",                    color: "#eab308" },
                { label: "Habilidades técnicas", desc: "Mostrar tu stack tecnológico (React, Node.js, etc.)",       color: "#a78bfa" },
                { label: "Mi perfil",            desc: "Personalizar tu información pública",                        color: "#34d399" },
              ]
            : [
                { label: "Proyectos personales", desc: "Proyectos propios que deseas mostrar en tu portafolio",     color: "#06b6d4" },
                { label: "Certificados",         desc: "Agregar y gestionar tus certificaciones",                    color: "#a855f7" },
                { label: "Habilidades técnicas", desc: "Mostrar tu stack tecnológico (React, Node.js, etc.)",       color: "#10b981" },
                { label: "Proyectos disponibles", desc: "Ver y unirte a proyectos subidos por los fundadores",     color: "#f97316" },
                { label: "Mi perfil",            desc: "Personalizar tu información pública",                        color: "#ec4899" },
              ]
          ).map((item) => (
            <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "rgba(255,255,255,0.02)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.04)" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: item.color, flexShrink: 0 }} />
              <div>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#f1f0ff" }}>{item.label}</span>
                <span style={{ fontSize: 12, color: "rgba(241,240,255,0.35)", marginLeft: 8 }}>{item.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── RENDER DE SECCIÓN ─────────────────────────────────────────────────────────

function renderSection(section: Section, isFounder: boolean, displayName: string) {
  switch (section) {
    case "inicio":
      return <SectionInicio displayName={displayName} isFounder={isFounder} />;

    case "perfil":
      return <SectionPerfil />;

    case "usuarios":
      return <SectionUsuarios />;

    case "servicios":
      return <Placeholder title="Gestión de servicios" description="Administra los servicios que ofrece KodaFix: título, descripción, tecnologías y visibilidad." buttonLabel="Gestionar servicios" color="#06b6d4" />;

    case "planes":
      return <Placeholder title="Gestión de planes" description="Crea y edita los planes disponibles: nombre, precio de implementación, mensualidad y características incluidas." buttonLabel="Gestionar planes" color="#10b981" />;

    case "proyectos-clientes":
      return <Placeholder title="Proyectos de clientes" description="Sube y administra los proyectos solicitados por clientes. La info llegará al correo y deberás ingresarla manualmente." buttonLabel="Ver proyectos" color="#f97316" />;

    case "proyectos-personales":
      return <SectionProyectosPersonales />;

    case "certificados":
      return <Placeholder title="Certificados" description="Agrega tus certificaciones profesionales: nombre, institución, fecha y enlace de verificación." buttonLabel="Mis certificados" color="#eab308" />;

    case "habilidades":
      return <Placeholder title="Habilidades técnicas" description="Muestra tu stack tecnológico: React, Node.js, Express, Java, Python y cualquier tecnología que domines." buttonLabel="Mis habilidades" color="#a78bfa" />;

    default:
      return null;
  }
}

// ── DASHBOARD PRINCIPAL ───────────────────────────────────────────────────────

export default function Dashboard() {
  const navigate            = useNavigate();
  const { user, isFounder } = useAuthContext();
  const [section, setSection] = useState<Section>("inicio");

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login", { replace: true });
  };

  const displayName = user?.displayName ?? "Usuario";
  const email       = user?.email ?? "";

  // Menú según rol
  const founderMenu: MenuItem[] = [
    { id: "inicio",               label: "Inicio",               icon: I.home },
    { id: "usuarios",             label: "Usuarios",             icon: I.users,   color: "#a855f7" },
    { id: "servicios",            label: "Servicios",            icon: I.service, color: "#06b6d4" },
    { id: "planes",               label: "Planes",               icon: I.plans,   color: "#10b981" },
    { id: "proyectos-clientes",   label: "Proyectos clientes",   icon: I.projCli, color: "#f97316" },
    { id: "proyectos-personales", label: "Proyectos personales", icon: I.projPer, color: "#ec4899" },
    { id: "certificados",         label: "Certificados",         icon: I.cert,    color: "#eab308" },
    { id: "habilidades",          label: "Habilidades",          icon: I.skills,  color: "#a78bfa" },
    { id: "perfil",               label: "Mi perfil",            icon: I.profile, color: "#34d399" },
  ];

  const adminMenu: MenuItem[] = [
    { id: "inicio",               label: "Inicio",               icon: I.home },
    { id: "proyectos-personales", label: "Proyectos personales", icon: I.projPer, color: "#06b6d4" },
    { id: "proyectos-clientes",   label: "Proyectos disponibles",icon: I.projCli, color: "#f97316" },
    { id: "certificados",         label: "Certificados",         icon: I.cert,    color: "#a855f7" },
    { id: "habilidades",          label: "Habilidades",          icon: I.skills,  color: "#10b981" },
    { id: "perfil",               label: "Mi perfil",            icon: I.profile, color: "#ec4899" },
  ];

  const menuItems = isFounder ? founderMenu : adminMenu;

  return (
    <div style={{ background: "#070710", minHeight: "100vh", fontFamily: "'Outfit', sans-serif", display: "flex" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; }
      `}</style>

      <Sidebar
        items={menuItems}
        active={section}
        onSelect={setSection}
        displayName={displayName}
        email={email}
        roleLabel={isFounder ? "Fundador" : "Administrador"}
        avatarGradient={isFounder ? "linear-gradient(135deg,#3b0764,#7c3aed)" : "linear-gradient(135deg,#083344,#0891b2)"}
        onLogout={handleLogout}
      />

      <main style={{ flex: 1, overflowY: "auto", padding: "36px 40px", maxWidth: "calc(100vw - 240px)" }}>
        {renderSection(section, isFounder, displayName)}
      </main>
    </div>
  );
}