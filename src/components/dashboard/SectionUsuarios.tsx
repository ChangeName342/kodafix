import { useState, useEffect, useCallback } from "react";
import {
  listUsers, createAdminUser, updateUser,
  deleteUserFromFirestore, validateEmail, validateDisplayName,
} from "../../services/authService";
import type { UserData } from "../../services/authService";
import type { UserRole } from "../../hooks/useAuth";

// ── Estilos ───────────────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 14px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 10, color: "#f1f0ff",
  fontSize: 14, fontFamily: "'Outfit', sans-serif", outline: "none",
};
const inputErr: React.CSSProperties = { ...inputStyle, border: "1px solid rgba(239,68,68,0.5)" };
const btnPrimary: React.CSSProperties = {
  background: "linear-gradient(135deg,#7c3aed,#a855f7)", border: "none",
  color: "#fff", padding: "10px 20px", borderRadius: 9,
  fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit', sans-serif",
};
const btnDanger: React.CSSProperties = {
  background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)",
  color: "#f87171", padding: "7px 14px", borderRadius: 8,
  fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit', sans-serif",
};
const btnSecondary: React.CSSProperties = {
  background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.25)",
  color: "#a855f7", padding: "7px 14px", borderRadius: 8,
  fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit', sans-serif",
};

function Label({ text, note }: { text: string; note?: string }) {
  return (
    <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "rgba(241,240,255,0.4)", marginBottom: 7, letterSpacing: "0.06em", textTransform: "uppercase" }}>
      {text}{note && <span style={{ color: "rgba(168,85,247,0.7)", fontWeight: 400, marginLeft: 4 }}>{note}</span>}
    </label>
  );
}
function FieldError({ msg }: { msg?: string }) {
  return msg ? <span style={{ fontSize: 11, color: "#f87171", marginTop: 4, display: "block" }}>{msg}</span> : null;
}

// ── MODAL ─────────────────────────────────────────────────────────────────────

type ModalMode = "create" | "edit" | "delete" | null;

function Modal({ mode, user, onClose, onRefresh }: {
  mode: ModalMode; user: UserData | null;
  onClose: () => void; onRefresh: () => void;
}) {
  const [displayName, setDisplayName]         = useState(user?.displayName ?? "");
  const [email, setEmail]                     = useState("");
  const [role, setRole]                       = useState<UserRole>(user?.role ?? "admin");
  const [founderPassword, setFounderPassword] = useState("");
  const [showFounderPass, setShowFounderPass] = useState(false);
  const [errors, setErrors]                   = useState<Record<string, string>>({});
  const [loading, setLoading]                 = useState(false);
  const [success, setSuccess]                 = useState("");

  if (!mode) return null;

  const validate = () => {
    const e: Record<string, string> = {};
    const nErr = validateDisplayName(displayName);
    if (nErr) e.displayName = nErr;
    if (mode === "create") {
      const eErr = validateEmail(email);
      if (eErr) e.email = eErr;
      if (!founderPassword) e.founderPassword = "Ingresa tu contraseña para confirmar.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCreate = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await createAdminUser(email, displayName, role, founderPassword);
      setSuccess(`✓ Usuario creado. Se envió un correo a ${email} para establecer su contraseña.`);
      setTimeout(() => { onRefresh(); onClose(); }, 2500);
    } catch (err: unknown) {
      const msg = (err as Error).message;
      if (msg.includes("wrong-password") || msg.includes("invalid-credential"))
        setErrors({ founderPassword: "Contraseña incorrecta." });
      else if (msg.includes("email-already-in-use"))
        setErrors({ email: "Este correo ya está registrado." });
      else
        setErrors({ general: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!validate() || !user) return;
    setLoading(true);
    try {
      await updateUser(user.uid, { displayName, role });
      onRefresh(); onClose();
    } catch (err: unknown) {
      setErrors({ general: (err as Error).message });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await deleteUserFromFirestore(user.uid);
      onRefresh(); onClose();
    } catch (err: unknown) {
      setErrors({ general: (err as Error).message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ background: "#0e0e1a", border: "1px solid rgba(168,85,247,0.2)", borderRadius: 20, padding: 32, width: "100%", maxWidth: 440 }}>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#f1f0ff", letterSpacing: -0.3 }}>
            {mode === "create" && "Crear usuario"}
            {mode === "edit"   && "Editar usuario"}
            {mode === "delete" && "Eliminar usuario"}
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(241,240,255,0.4)", fontSize: 20 }}>✕</button>
        </div>

        {mode === "delete" ? (
          <>
            <p style={{ fontSize: 14, color: "rgba(241,240,255,0.6)", marginBottom: 8, lineHeight: 1.6 }}>
              ¿Eliminar a <strong style={{ color: "#f1f0ff" }}>{user?.displayName}</strong>?
            </p>
            <p style={{ fontSize: 13, color: "rgba(239,68,68,0.7)", marginBottom: 24 }}>
              Se eliminará el registro de Firestore. El usuario no podrá iniciar sesión.
            </p>
            {errors.general && <p style={{ fontSize: 12, color: "#f87171", marginBottom: 16 }}>{errors.general}</p>}
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={onClose}       style={{ ...btnSecondary, flex: 1 }}>Cancelar</button>
              <button onClick={handleDelete}  disabled={loading} style={{ ...btnDanger, flex: 1, opacity: loading ? 0.6 : 1 }}>
                {loading ? "Eliminando..." : "Sí, eliminar"}
              </button>
            </div>
          </>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Nombre */}
            <div>
              <Label text="Nombre completo" />
              <input type="text" value={displayName} placeholder="Nombre Apellido"
                onChange={(e) => { setDisplayName(e.target.value); setErrors((p) => ({ ...p, displayName: "" })); }}
                style={errors.displayName ? inputErr : inputStyle}
              />
              <FieldError msg={errors.displayName} />
            </div>

            {/* Email — solo al crear */}
            {mode === "create" && (
              <div>
                <Label text="Correo" note="(@kodafix.cl)" />
                <input type="email" value={email} placeholder="nombre@kodafix.cl"
                  onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: "" })); }}
                  style={errors.email ? inputErr : inputStyle}
                />
                <FieldError msg={errors.email} />
              </div>
            )}

            {/* Rol */}
            <div>
              <Label text="Rol" />
              <div style={{ display: "flex", gap: 10 }}>
                {(["founder", "admin"] as UserRole[]).map((r) => (
                  <button key={r} onClick={() => setRole(r)} style={{
                    flex: 1, padding: "10px", borderRadius: 9, fontSize: 13, fontWeight: 600,
                    cursor: "pointer", fontFamily: "'Outfit', sans-serif", transition: "all .15s",
                    background: role === r ? (r === "founder" ? "rgba(168,85,247,0.15)" : "rgba(6,182,212,0.15)") : "rgba(255,255,255,0.04)",
                    border:     role === r ? (r === "founder" ? "1px solid rgba(168,85,247,0.4)" : "1px solid rgba(6,182,212,0.4)") : "1px solid rgba(255,255,255,0.08)",
                    color:      role === r ? (r === "founder" ? "#a855f7" : "#06b6d4") : "rgba(241,240,255,0.4)",
                  }}>
                    {r === "founder" ? "Fundador" : "Administrador"}
                  </button>
                ))}
              </div>
            </div>

            {/* Contraseña del fundador — solo al crear */}
            {mode === "create" && (
              <div>
                <Label text="Tu contraseña" note="(para confirmar)" />
                <div style={{ position: "relative" }}>
                  <input
                    type={showFounderPass ? "text" : "password"}
                    value={founderPassword} placeholder="••••••••"
                    onChange={(e) => { setFounderPassword(e.target.value); setErrors((p) => ({ ...p, founderPassword: "" })); }}
                    style={{ ...(errors.founderPassword ? inputErr : inputStyle), paddingRight: 44 }}
                  />
                  <button type="button" onClick={() => setShowFounderPass(!showFounderPass)}
                    style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(241,240,255,0.3)", padding: 4 }}
                  >
                    {showFounderPass
                      ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </button>
                </div>
                <FieldError msg={errors.founderPassword} />
                <p style={{ fontSize: 11, color: "rgba(241,240,255,0.3)", marginTop: 6, lineHeight: 1.5 }}>
                  Necesaria para mantenerte autenticado después de crear el usuario.
                </p>
              </div>
            )}

            {errors.general && <p style={{ fontSize: 12, color: "#f87171" }}>{errors.general}</p>}
            {success        && <p style={{ fontSize: 12, color: "#34d399", lineHeight: 1.5 }}>{success}</p>}

            <button
              onClick={mode === "create" ? handleCreate : handleEdit}
              disabled={loading}
              style={{ ...btnPrimary, width: "100%", marginTop: 4, opacity: loading ? 0.6 : 1 }}
            >
              {loading ? "Guardando..." : mode === "create" ? "Crear usuario" : "Guardar cambios"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── SECCIÓN PRINCIPAL ─────────────────────────────────────────────────────────

export default function SectionUsuarios() {
  const [users, setUsers]   = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState("");
  const [modal, setModal]   = useState<{ mode: ModalMode; user: UserData | null }>({ mode: null, user: null });

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const data = await listUsers();
      setUsers(data.sort((a, b) => a.displayName.localeCompare(b.displayName)));
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        .user-row:hover { background: rgba(168,85,247,0.04) !important; }
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#f1f0ff", letterSpacing: -0.5, marginBottom: 4 }}>Gestión de usuarios</h1>
          <p style={{ fontSize: 14, color: "rgba(241,240,255,0.4)" }}>
            Solo se permiten correos <span style={{ color: "#a855f7" }}>@kodafix.cl</span>
          </p>
        </div>
        <button onClick={() => setModal({ mode: "create", user: null })} style={btnPrimary}>
          + Crear usuario
        </button>
      </div>

      {loading && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 24, color: "rgba(241,240,255,0.4)", fontSize: 14 }}>
          <div style={{ width: 20, height: 20, border: "2px solid rgba(168,85,247,0.2)", borderTop: "2px solid #a855f7", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          Cargando usuarios...
        </div>
      )}

      {error && (
        <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#f87171", marginBottom: 20 }}>
          {error}
        </div>
      )}

      {!loading && !error && (
        <div style={{ background: "#0e0e1a", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 16, overflow: "hidden" }}>
          {/* Header tabla */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto auto", gap: 16, padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.02)" }}>
            {["Nombre", "Correo", "Rol", "Acciones"].map((h) => (
              <span key={h} style={{ fontSize: 11, fontWeight: 700, color: "rgba(241,240,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</span>
            ))}
          </div>

          {users.length === 0 ? (
            <div style={{ padding: "40px 20px", textAlign: "center", color: "rgba(241,240,255,0.3)", fontSize: 14 }}>No hay usuarios registrados.</div>
          ) : users.map((u) => (
            <div key={u.uid} className="user-row"
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto auto", gap: 16, padding: "14px 20px", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.03)", transition: "background .15s" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", flexShrink: 0, background: u.role === "founder" ? "linear-gradient(135deg,#3b0764,#7c3aed)" : "linear-gradient(135deg,#083344,#0891b2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff" }}>
                  {u.displayName.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
                </div>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#f1f0ff" }}>{u.displayName}</span>
              </div>

              <span style={{ fontSize: 13, color: "rgba(241,240,255,0.5)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.email}</span>

              <span style={{ fontSize: 11, fontWeight: 600, padding: "4px 12px", borderRadius: 100, whiteSpace: "nowrap", background: u.role === "founder" ? "rgba(168,85,247,0.12)" : "rgba(6,182,212,0.12)", color: u.role === "founder" ? "#a855f7" : "#06b6d4", border: u.role === "founder" ? "1px solid rgba(168,85,247,0.25)" : "1px solid rgba(6,182,212,0.25)" }}>
                {u.role === "founder" ? "Fundador" : "Admin"}
              </span>

              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setModal({ mode: "edit",   user: u })} style={btnSecondary}>Editar</button>
                <button onClick={() => setModal({ mode: "delete", user: u })} style={btnDanger}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      {!loading && users.length > 0 && (
        <div style={{ display: "flex", gap: 16, marginTop: 20, flexWrap: "wrap" }}>
          {[
            { label: "Total",      value: users.length,                                    color: "#a855f7" },
            { label: "Fundadores", value: users.filter((u) => u.role === "founder").length, color: "#a855f7" },
            { label: "Admins",     value: users.filter((u) => u.role === "admin").length,   color: "#06b6d4" },
          ].map((s) => (
            <div key={s.label} style={{ background: "#0e0e1a", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 12, padding: "14px 20px", display: "flex", gap: 10, alignItems: "center" }}>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</span>
              <span style={{ fontSize: 12, color: "rgba(241,240,255,0.4)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</span>
            </div>
          ))}
        </div>
      )}

      <Modal mode={modal.mode} user={modal.user} onClose={() => setModal({ mode: null, user: null })} onRefresh={load} />
    </>
  );
}