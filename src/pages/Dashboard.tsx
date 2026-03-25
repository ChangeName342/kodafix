import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { logoutUser } from "../services/authService";

// ── ICONOS ────────────────────────────────────────────────────────────────────

const Icons = {
  home:    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  project: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  team:    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  service: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>,
  users:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  profile: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  logout:  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
};

// ── SIDEBAR ───────────────────────────────────────────────────────────────────

function Sidebar({
  menuItems,
  displayName,
  email,
  roleLabel,
  avatarGradient,
  onLogout,
}: {
  menuItems: { label: string; icon: React.ReactNode; active?: boolean }[];
  displayName: string;
  email: string;
  roleLabel: string;
  avatarGradient: string;
  onLogout: () => void;
}) {
  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <aside style={{ width: 240, background: "#0a0a14", borderRight: "1px solid rgba(255,255,255,0.05)", display: "flex", flexDirection: "column", flexShrink: 0 }}>

      {/* Logo */}
      <div style={{ padding: "24px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, background: "linear-gradient(135deg,#1a0a2e,#2d1557)", borderRadius: 8, border: "1px solid rgba(168,85,247,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <img src="/logo.png" alt="KodaFix" style={{ width: 34, height: 34, objectFit: "contain" }} />
          </div>
          <div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 15, fontWeight: 700, color: "#a855f7" }}>
              Koda<span style={{ color: "#f1f0ff" }}>Fix</span>
            </span>
            <div style={{ fontSize: 10, color: "rgba(241,240,255,0.3)", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 1 }}>
              {roleLabel}
            </div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 2 }}>
        {menuItems.map((item) => (
          <div
            key={item.label}
            className={`menu-item${item.active ? " active" : ""}`}
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 8, color: item.active ? "#a855f7" : "rgba(241,240,255,0.4)", fontSize: 13, fontWeight: 500 }}
          >
            {item.icon}
            {item.label}
          </div>
        ))}
      </nav>

      {/* User + Logout */}
      <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 8, background: "rgba(255,255,255,0.03)" }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: avatarGradient, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
            {initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#f1f0ff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{displayName}</div>
            <div style={{ fontSize: 10, color: "rgba(241,240,255,0.3)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{email}</div>
          </div>
          <button
            onClick={onLogout}
            style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(241,240,255,0.3)", padding: 4, transition: "color .2s" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#ef4444")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "rgba(241,240,255,0.3)")}
            title="Cerrar sesión"
          >
            {Icons.logout}
          </button>
        </div>
      </div>
    </aside>
  );
}

// ── PROYECTOS DE MUESTRA ──────────────────────────────────────────────────────

const sampleProjects = [
  { name: "App E-commerce",      client: "TechStore", status: "En progreso", statusColor: "#06b6d4", statusBg: "rgba(6,182,212,0.1)" },
  { name: "Dashboard Analytics", client: "DataCorp",  status: "Revisión",   statusColor: "#eab308", statusBg: "rgba(234,179,8,0.1)" },
  { name: "Landing SaaS",        client: "StartupX",  status: "Completado", statusColor: "#10b981", statusBg: "rgba(16,185,129,0.1)" },
  { name: "App Mobile iOS",      client: "FitLife",   status: "En progreso", statusColor: "#06b6d4", statusBg: "rgba(6,182,212,0.1)" },
];

function ProjectRow({ p }: { p: typeof sampleProjects[0] }) {
  return (
    <div
      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderRadius: 10, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", transition: "background .2s", cursor: "pointer" }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.background = "rgba(168,85,247,0.05)")}
      onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.02)")}
    >
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#f1f0ff", marginBottom: 2 }}>{p.name}</div>
        <div style={{ fontSize: 12, color: "rgba(241,240,255,0.35)" }}>{p.client}</div>
      </div>
      <span style={{ fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 100, color: p.statusColor, background: p.statusBg }}>{p.status}</span>
    </div>
  );
}

// ── DASHBOARD FUNDADOR ────────────────────────────────────────────────────────

function FounderDashboard({ displayName, email, onLogout }: { displayName: string; email: string; onLogout: () => void }) {
  const stats = [
    { label: "Proyectos activos", value: "12", color: "#a855f7", bg: "rgba(168,85,247,0.08)", border: "rgba(168,85,247,0.15)" },
    { label: "Servicios",         value: "6",  color: "#06b6d4", bg: "rgba(6,182,212,0.08)",  border: "rgba(6,182,212,0.15)" },
    { label: "Miembros equipo",   value: "3",  color: "#10b981", bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.15)" },
    { label: "Mensajes nuevos",   value: "5",  color: "#f97316", bg: "rgba(249,115,22,0.08)", border: "rgba(249,115,22,0.15)" },
  ];

  const menuItems = [
    { label: "Inicio",      icon: Icons.home,    active: true },
    { label: "Proyectos",   icon: Icons.project },
    { label: "Servicios",   icon: Icons.service },
    { label: "Equipo",      icon: Icons.team },
    { label: "Usuarios",    icon: Icons.users },
  ];

  return (
    <div style={{ background: "#070710", minHeight: "100vh", fontFamily: "'Outfit', sans-serif", display: "flex" }}>
      <Sidebar menuItems={menuItems} displayName={displayName} email={email} roleLabel="Fundador" avatarGradient="linear-gradient(135deg,#3b0764,#7c3aed)" onLogout={onLogout} />

      <main style={{ flex: 1, overflowY: "auto", padding: "32px 36px" }}>

        {/* Badge rol */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.25)", borderRadius: 100, padding: "5px 14px", marginBottom: 24 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#a855f7" }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: "#a855f7", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Rol activo: Fundador ✓
          </span>
        </div>

        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#f1f0ff", letterSpacing: -0.5, marginBottom: 4 }}>
            Bienvenido, {displayName.split(" ")[0]} 👋
          </h1>
          <p style={{ fontSize: 14, color: "rgba(241,240,255,0.4)" }}>
            Tienes acceso completo: usuarios, servicios, equipo y proyectos.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4" style={{ marginBottom: 32 }}>
          {stats.map((s) => (
            <div key={s.label} className="stat-card rounded-xl p-5" style={{ background: s.bg, border: `1px solid ${s.border}` }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: s.color, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1, marginBottom: 8 }}>{s.value}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(241,240,255,0.5)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Proyectos recientes */}
        <div style={{ background: "#0e0e1a", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 16, padding: "24px", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#f1f0ff" }}>Proyectos recientes</h2>
            <button style={{ fontSize: 12, fontWeight: 600, color: "#a855f7", background: "none", border: "none", cursor: "pointer" }}>Ver todos →</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {sampleProjects.map((p, i) => <ProjectRow key={i} p={p} />)}
          </div>
        </div>

        {/* Gestión de usuarios — solo fundadores */}
        <div style={{ background: "rgba(168,85,247,0.05)", border: "1px solid rgba(168,85,247,0.15)", borderRadius: 16, padding: "24px" }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#f1f0ff", marginBottom: 6 }}>Gestión de usuarios</h2>
          <p style={{ fontSize: 13, color: "rgba(241,240,255,0.4)", marginBottom: 16 }}>
            Exclusivo para fundadores. Crea y administra usuarios administradores.
          </p>
          <button style={{ background: "linear-gradient(135deg,#7c3aed,#a855f7)", border: "none", color: "#fff", padding: "9px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>
            + Crear usuario
          </button>
        </div>
      </main>
    </div>
  );
}

// ── DASHBOARD ADMIN ───────────────────────────────────────────────────────────

function AdminDashboard({ displayName, email, onLogout }: { displayName: string; email: string; onLogout: () => void }) {
  const stats = [
    { label: "Mis proyectos", value: "4", color: "#06b6d4", bg: "rgba(6,182,212,0.08)",  border: "rgba(6,182,212,0.15)" },
    { label: "En progreso",   value: "2", color: "#a855f7", bg: "rgba(168,85,247,0.08)", border: "rgba(168,85,247,0.15)" },
    { label: "Completados",   value: "2", color: "#10b981", bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.15)" },
    { label: "Mensajes",      value: "3", color: "#f97316", bg: "rgba(249,115,22,0.08)", border: "rgba(249,115,22,0.15)" },
  ];

  const menuItems = [
    { label: "Inicio",        icon: Icons.home,    active: true },
    { label: "Mis proyectos", icon: Icons.project },
    { label: "Mi perfil",     icon: Icons.profile },
  ];

  return (
    <div style={{ background: "#070710", minHeight: "100vh", fontFamily: "'Outfit', sans-serif", display: "flex" }}>
      <Sidebar menuItems={menuItems} displayName={displayName} email={email} roleLabel="Administrador" avatarGradient="linear-gradient(135deg,#083344,#0891b2)" onLogout={onLogout} />

      <main style={{ flex: 1, overflowY: "auto", padding: "32px 36px" }}>

        {/* Badge rol */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(6,182,212,0.08)", border: "1px solid rgba(6,182,212,0.25)", borderRadius: 100, padding: "5px 14px", marginBottom: 24 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#06b6d4" }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: "#06b6d4", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Rol activo: Administrador ✓
          </span>
        </div>

        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#f1f0ff", letterSpacing: -0.5, marginBottom: 4 }}>
            Bienvenido, {displayName.split(" ")[0]} 👋
          </h1>
          <p style={{ fontSize: 14, color: "rgba(241,240,255,0.4)" }}>
            Gestiona tus proyectos y personaliza tu perfil.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4" style={{ marginBottom: 32 }}>
          {stats.map((s) => (
            <div key={s.label} className="stat-card rounded-xl p-5" style={{ background: s.bg, border: `1px solid ${s.border}` }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: s.color, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1, marginBottom: 8 }}>{s.value}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(241,240,255,0.5)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Mis proyectos */}
        <div style={{ background: "#0e0e1a", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 16, padding: "24px", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#f1f0ff" }}>Mis proyectos</h2>
            <button style={{ fontSize: 12, fontWeight: 600, color: "#06b6d4", background: "none", border: "none", cursor: "pointer" }}>+ Agregar →</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {sampleProjects.slice(0, 2).map((p, i) => <ProjectRow key={i} p={p} />)}
          </div>
        </div>

        {/* Perfil */}
        <div style={{ background: "rgba(6,182,212,0.05)", border: "1px solid rgba(6,182,212,0.15)", borderRadius: 16, padding: "24px" }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#f1f0ff", marginBottom: 6 }}>Mi perfil</h2>
          <p style={{ fontSize: 13, color: "rgba(241,240,255,0.4)", marginBottom: 16 }}>
            Personaliza tu información y cambia tu contraseña.
          </p>
          <button style={{ background: "linear-gradient(135deg,#0e7490,#06b6d4)", border: "none", color: "#fff", padding: "9px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>
            Editar perfil
          </button>
        </div>
      </main>
    </div>
  );
}

// ── EXPORT PRINCIPAL ──────────────────────────────────────────────────────────

export default function Dashboard() {
  const navigate   = useNavigate();
  const { user, isFounder } = useAuthContext();

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login", { replace: true });
  };

  const displayName = user?.displayName ?? "Usuario";
  const email       = user?.email ?? "";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; }
        .menu-item { transition: background .2s, color .2s; cursor: pointer; }
        .menu-item:hover { background: rgba(168,85,247,0.08) !important; color: #f1f0ff !important; }
        .menu-item.active { background: rgba(168,85,247,0.12) !important; color: #a855f7 !important; }
        .stat-card { transition: transform .2s; }
        .stat-card:hover { transform: translateY(-2px); }
      `}</style>

      {isFounder
        ? <FounderDashboard displayName={displayName} email={email} onLogout={handleLogout} />
        : <AdminDashboard   displayName={displayName} email={email} onLogout={handleLogout} />
      }
    </>
  );
}