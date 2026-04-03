import { useState, useEffect, useRef, useCallback } from "react";
import { useAuthContext } from "../../context/AuthContext";
import {
  getProyectosPersonales, createProyecto, updateProyecto,
  deleteProyecto, uploadProyectoImage, validateProyecto,
  TIPOS_PROYECTO, EMPTY_FORM,
} from "../../services/projectsService";
import type { ProyectoPersonal, ProyectoForm, TipoProyecto } from "../../services/projectsService";

// ── Estilos base ──────────────────────────────────────────────────────────────

const inputBase: React.CSSProperties = {
  width: "100%", padding: "10px 14px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 10, color: "#f1f0ff",
  fontSize: 14, fontFamily: "'Outfit', sans-serif", outline: "none",
};
const inputErr: React.CSSProperties = { ...inputBase, border: "1px solid rgba(239,68,68,0.5)" };
const btnPrimary: React.CSSProperties = {
  background: "linear-gradient(135deg,#7c3aed,#a855f7)",
  border: "none", color: "#fff", padding: "10px 20px",
  borderRadius: 9, fontSize: 13, fontWeight: 600,
  cursor: "pointer", fontFamily: "'Outfit', sans-serif",
};
const btnDanger: React.CSSProperties = {
  background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)",
  color: "#f87171", padding: "7px 14px", borderRadius: 8,
  fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit', sans-serif",
};
const btnGhost: React.CSSProperties = {
  background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.2)",
  color: "#a855f7", padding: "7px 14px", borderRadius: 8,
  fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit', sans-serif",
};

function Field({ label, hint, error, children }: {
  label: string; hint?: string; error?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
        <label style={{ fontSize: 11, fontWeight: 600, color: "rgba(241,240,255,0.4)", letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</label>
        {hint && <span style={{ fontSize: 11, color: "rgba(241,240,255,0.25)" }}>{hint}</span>}
      </div>
      {children}
      {error && <span style={{ fontSize: 11, color: "#f87171", marginTop: 4, display: "block" }}>{error}</span>}
    </div>
  );
}

// ── Tag input (stack y miembros) ──────────────────────────────────────────────

function TagInput({ values, onChange, placeholder, color = "#a855f7" }: {
  values: string[]; onChange: (v: string[]) => void;
  placeholder: string; color?: string;
}) {
  const [input, setInput] = useState("");

  const add = () => {
    const v = input.trim();
    if (v && !values.includes(v)) onChange([...values, v]);
    setInput("");
  };

  const remove = (val: string) => onChange(values.filter((v) => v !== val));

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: values.length ? 8 : 0 }}>
        <input
          type="text" value={input} placeholder={placeholder}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          style={{ ...inputBase, flex: 1 }}
        />
        <button type="button" onClick={add} style={{ ...btnGhost, whiteSpace: "nowrap" }}>
          + Agregar
        </button>
      </div>
      {values.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {values.map((v) => (
            <span key={v} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 100, background: `${color}12`, border: `1px solid ${color}30`, color }}>
              {v}
              <button onClick={() => remove(v)} style={{ background: "none", border: "none", cursor: "pointer", color, padding: 0, lineHeight: 1, fontSize: 14 }}>×</button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Image uploader ────────────────────────────────────────────────────────────

function ImageUploader({ preview, onFile, progress }: {
  preview: string; onFile: (f: File) => void; progress: number | null;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div
      onClick={() => fileRef.current?.click()}
      style={{
        width: "100%", height: 160, borderRadius: 12,
        border: "2px dashed rgba(168,85,247,0.25)",
        background: "rgba(168,85,247,0.04)",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", overflow: "hidden", position: "relative",
        transition: "border-color .2s",
      }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.borderColor = "rgba(168,85,247,0.5)")}
      onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.borderColor = "rgba(168,85,247,0.25)")}
    >
      {preview ? (
        <img src={preview} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <div style={{ textAlign: "center", pointerEvents: "none" }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(168,85,247,0.5)" strokeWidth="1.5" strokeLinecap="round" style={{ marginBottom: 8 }}>
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
          <p style={{ fontSize: 13, color: "rgba(241,240,255,0.35)", margin: 0 }}>Haz clic para subir imagen</p>
          <p style={{ fontSize: 11, color: "rgba(241,240,255,0.2)", margin: "4px 0 0" }}>JPG, PNG o WebP · Máx. 5 MB</p>
        </div>
      )}

      {progress !== null && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 20, fontWeight: 700, color: "#a855f7" }}>{progress}%</span>
        </div>
      )}

      <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }}
      />
    </div>
  );
}

// ── MODAL FORMULARIO ──────────────────────────────────────────────────────────

function ProyectoModal({ proyecto, uid, onClose, onSaved }: {
  proyecto: ProyectoPersonal | null; uid: string;
  onClose: () => void; onSaved: () => void;
}) {
  const isEdit = !!proyecto;
  const [form, setForm]           = useState<ProyectoForm>(proyecto
    ? { nombre: proyecto.nombre, descripcion: proyecto.descripcion, tipo: proyecto.tipo, stack: proyecto.stack, miembros: proyecto.miembros, imageURL: proyecto.imageURL, linkDemo: proyecto.linkDemo, linkRepo: proyecto.linkRepo }
    : { ...EMPTY_FORM }
  );
  const [preview, setPreview]     = useState(proyecto?.imageURL ?? "");
  const [pendingFile, setPending] = useState<File | null>(null);
  const [uploadPct, setUploadPct] = useState<number | null>(null);
  const [errors, setErrors]       = useState<Partial<Record<keyof ProyectoForm, string>>>({});
  const [loading, setLoading]     = useState(false);
  const [genError, setGenError]   = useState("");

  const setField = <K extends keyof ProyectoForm>(key: K, val: ProyectoForm[K]) => {
    setForm((p) => ({ ...p, [key]: val }));
    setErrors((p) => ({ ...p, [key]: "" }));
  };

  const handleFile = (file: File) => {
    setPending(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    const errs = validateProyecto(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true); setGenError("");
    try {
      let imageURL = form.imageURL;

      if (isEdit) {
        // Si hay imagen nueva, súbela primero
        if (pendingFile) {
          imageURL = await uploadProyectoImage(uid, proyecto!.id, pendingFile, setUploadPct);
          setUploadPct(null);
        }
        await updateProyecto(proyecto!.id, { ...form, imageURL });
      } else {
        // Crear primero para obtener el ID, luego subir imagen
        const newId = await createProyecto(uid, { ...form, imageURL: "" });
        if (pendingFile) {
          imageURL = await uploadProyectoImage(uid, newId, pendingFile, setUploadPct);
          setUploadPct(null);
          await updateProyecto(newId, { imageURL });
        }
      }

      onSaved();
      onClose();
    } catch (err: unknown) {
      setGenError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 300, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "24px 16px", background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)", overflowY: "auto" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ background: "#0e0e1a", border: "1px solid rgba(168,85,247,0.2)", borderRadius: 20, padding: 32, width: "100%", maxWidth: 600, marginBottom: 24 }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#f1f0ff", letterSpacing: -0.3 }}>
            {isEdit ? "Editar proyecto" : "Nuevo proyecto"}
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(241,240,255,0.4)", fontSize: 20 }}>✕</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Imagen */}
          <Field label="Imagen del proyecto">
            <ImageUploader preview={preview} onFile={handleFile} progress={uploadPct} />
          </Field>

          {/* Nombre */}
          <Field label="Nombre del proyecto" hint={`${form.nombre.length}/80`} error={errors.nombre}>
            <input type="text" value={form.nombre} placeholder="Ej: E-commerce TechStore"
              onChange={(e) => setField("nombre", e.target.value)}
              style={errors.nombre ? inputErr : inputBase}
            />
          </Field>

          {/* Tipo */}
          <Field label="Tipo de proyecto" error={errors.tipo}>
            <select value={form.tipo} onChange={(e) => setField("tipo", e.target.value as TipoProyecto)}
              style={{ ...inputBase, appearance: "none", cursor: "pointer" }}
            >
              {TIPOS_PROYECTO.map((t) => (
                <option key={t} value={t} style={{ background: "#0e0e1a" }}>{t}</option>
              ))}
            </select>
          </Field>

          {/* Descripción */}
          <Field label="Descripción" hint={`${form.descripcion.length}/500`} error={errors.descripcion}>
            <textarea value={form.descripcion} rows={4} placeholder="Describe el proyecto, su objetivo y resultado..."
              onChange={(e) => setField("descripcion", e.target.value)}
              style={{ ...(errors.descripcion ? inputErr : inputBase), resize: "vertical", minHeight: 100 }}
            />
          </Field>

          {/* Stack */}
          <Field label="Stack tecnológico" error={errors.stack}>
            <TagInput
              values={form.stack}
              onChange={(v) => setField("stack", v)}
              placeholder="Ej: React, Node.js... (Enter para agregar)"
              color="#a855f7"
            />
          </Field>

          {/* Miembros */}
          <Field label="Miembros del equipo">
            <TagInput
              values={form.miembros}
              onChange={(v) => setField("miembros", v)}
              placeholder="Ej: Kenneth Cárcamo (Enter para agregar)"
              color="#06b6d4"
            />
          </Field>

          {/* Links */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Field label="Link demo" error={errors.linkDemo}>
              <input type="url" value={form.linkDemo} placeholder="https://..."
                onChange={(e) => setField("linkDemo", e.target.value)}
                style={errors.linkDemo ? inputErr : inputBase}
              />
            </Field>
            <Field label="Repositorio" error={errors.linkRepo}>
              <input type="url" value={form.linkRepo} placeholder="https://github.com/..."
                onChange={(e) => setField("linkRepo", e.target.value)}
                style={errors.linkRepo ? inputErr : inputBase}
              />
            </Field>
          </div>

          {genError && (
            <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#f87171" }}>
              {genError}
            </div>
          )}

          <button onClick={handleSave} disabled={loading}
            style={{ ...btnPrimary, width: "100%", padding: "12px", fontSize: 15, opacity: loading ? 0.6 : 1, cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? (uploadPct !== null ? `Subiendo imagen ${uploadPct}%...` : "Guardando...") : isEdit ? "Guardar cambios" : "Crear proyecto"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── MODAL CONFIRMAR ELIMINAR ──────────────────────────────────────────────────

function DeleteModal({ proyecto, onClose, onDeleted }: {
  proyecto: ProyectoPersonal; onClose: () => void; onDeleted: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteProyecto(proyecto.id, proyecto.imageURL);
      onDeleted();
      onClose();
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ background: "#0e0e1a", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 20, padding: 32, width: "100%", maxWidth: 420 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: "#f1f0ff", marginBottom: 12 }}>Eliminar proyecto</h2>
        <p style={{ fontSize: 14, color: "rgba(241,240,255,0.6)", marginBottom: 8, lineHeight: 1.6 }}>
          ¿Eliminar <strong style={{ color: "#f1f0ff" }}>{proyecto.nombre}</strong>?
        </p>
        <p style={{ fontSize: 13, color: "rgba(239,68,68,0.7)", marginBottom: 24 }}>
          Se eliminará el proyecto y su imagen. Esta acción no se puede deshacer.
        </p>
        {error && <p style={{ fontSize: 12, color: "#f87171", marginBottom: 16 }}>{error}</p>}
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose}      style={{ ...btnGhost, flex: 1 }}>Cancelar</button>
          <button onClick={handleDelete} disabled={loading} style={{ ...btnDanger, flex: 1, opacity: loading ? 0.6 : 1 }}>
            {loading ? "Eliminando..." : "Sí, eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── TIPO COLOR ────────────────────────────────────────────────────────────────

const TIPO_COLOR: Record<string, string> = {
  "Desarrollo Web":        "#a855f7",
  "Aplicación Mobile":     "#06b6d4",
  "Inteligencia Artificial":"#ec4899",
  "Datos & Analítica":     "#f97316",
  "Cloud & DevOps":        "#eab308",
  "Diseño UI/UX":          "#10b981",
  "E-commerce":            "#fb923c",
  "Automatización":        "#a78bfa",
  "Otro":                  "#888",
};

// ── TARJETA ───────────────────────────────────────────────────────────────────

function ProyectoCard({ proyecto, onEdit, onDelete }: {
  proyecto: ProyectoPersonal;
  onEdit: () => void; onDelete: () => void;
}) {
  const color = TIPO_COLOR[proyecto.tipo] ?? "#a855f7";

  return (
    <div style={{ background: "#0e0e1a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, overflow: "hidden", display: "flex", flexDirection: "column", transition: "border-color .2s, transform .2s" }}
      onMouseEnter={(e) => { const d = e.currentTarget as HTMLDivElement; d.style.borderColor = `${color}30`; d.style.transform = "translateY(-3px)"; }}
      onMouseLeave={(e) => { const d = e.currentTarget as HTMLDivElement; d.style.borderColor = "rgba(255,255,255,0.06)"; d.style.transform = ""; }}
    >
      {/* Imagen */}
      <div style={{ height: 160, background: `linear-gradient(135deg,${color}20,rgba(0,0,0,0.4))`, position: "relative", overflow: "hidden" }}>
        {proyecto.imageURL
          ? <img src={proyecto.imageURL} alt={proyecto.nombre} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={`${color}60`} strokeWidth="1.5" strokeLinecap="round">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
            </div>
          )
        }
        {/* Badge tipo */}
        <span style={{ position: "absolute", top: 10, left: 10, fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 100, background: `${color}22`, border: `1px solid ${color}40`, color, backdropFilter: "blur(4px)", letterSpacing: "0.06em" }}>
          {proyecto.tipo}
        </span>
      </div>

      {/* Contenido */}
      <div style={{ padding: "18px 18px 14px", flex: 1, display: "flex", flexDirection: "column" }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: "#f1f0ff", marginBottom: 8, letterSpacing: -0.3 }}>{proyecto.nombre}</h3>
        <p style={{ fontSize: 12, color: "rgba(241,240,255,0.5)", lineHeight: 1.6, marginBottom: 12, flex: 1, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {proyecto.descripcion}
        </p>

        {/* Stack */}
        {proyecto.stack.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
            {proyecto.stack.slice(0, 4).map((s) => (
              <span key={s} style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 100, background: "rgba(255,255,255,0.05)", color: "rgba(241,240,255,0.45)", border: "1px solid rgba(255,255,255,0.07)" }}>
                {s}
              </span>
            ))}
            {proyecto.stack.length > 4 && (
              <span style={{ fontSize: 10, color: "rgba(241,240,255,0.3)", padding: "2px 6px" }}>+{proyecto.stack.length - 4}</span>
            )}
          </div>
        )}

        {/* Miembros */}
        {proyecto.miembros.length > 0 && (
          <p style={{ fontSize: 11, color: "rgba(241,240,255,0.35)", marginBottom: 12 }}>
            👥 {proyecto.miembros.slice(0, 2).join(", ")}{proyecto.miembros.length > 2 ? ` +${proyecto.miembros.length - 2}` : ""}
          </p>
        )}

        {/* Links */}
        {(proyecto.linkDemo || proyecto.linkRepo) && (
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            {proyecto.linkDemo && (
              <a href={proyecto.linkDemo} target="_blank" rel="noopener noreferrer"
                style={{ fontSize: 11, color, background: `${color}10`, border: `1px solid ${color}25`, borderRadius: 6, padding: "4px 10px", textDecoration: "none", fontWeight: 600 }}
              >
                Demo →
              </a>
            )}
            {proyecto.linkRepo && (
              <a href={proyecto.linkRepo} target="_blank" rel="noopener noreferrer"
                style={{ fontSize: 11, color: "rgba(241,240,255,0.5)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: "4px 10px", textDecoration: "none", fontWeight: 600 }}
              >
                Repo
              </a>
            )}
          </div>
        )}

        {/* Acciones */}
        <div style={{ display: "flex", gap: 8, borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 12 }}>
          <button onClick={onEdit}   style={{ ...btnGhost,  flex: 1, textAlign: "center" }}>Editar</button>
          <button onClick={onDelete} style={{ ...btnDanger, flex: 1, textAlign: "center" }}>Eliminar</button>
        </div>
      </div>
    </div>
  );
}

// ── SECCIÓN PRINCIPAL ─────────────────────────────────────────────────────────

export default function SectionProyectosPersonales() {
  const { user } = useAuthContext();
  const [proyectos, setProyectos] = useState<ProyectoPersonal[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [modal, setModal]         = useState<"form" | "delete" | null>(null);
  const [selected, setSelected]   = useState<ProyectoPersonal | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true); setError("");
    try {
      setProyectos(await getProyectosPersonales(user.uid));
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setSelected(null); setModal("form"); };
  const openEdit   = (p: ProyectoPersonal) => { setSelected(p); setModal("form"); };
  const openDelete = (p: ProyectoPersonal) => { setSelected(p); setModal("delete"); };
  const closeModal = () => { setModal(null); setSelected(null); };

  return (
    <>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#f1f0ff", letterSpacing: -0.5, marginBottom: 4 }}>Proyectos personales</h1>
          <p style={{ fontSize: 14, color: "rgba(241,240,255,0.4)" }}>
            {proyectos.length > 0 ? `${proyectos.length} proyecto${proyectos.length > 1 ? "s" : ""}` : "Muestra tu trabajo al mundo"}
          </p>
        </div>
        <button onClick={openCreate} style={btnPrimary}>+ Nuevo proyecto</button>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 24, color: "rgba(241,240,255,0.4)", fontSize: 14 }}>
          <div style={{ width: 20, height: 20, border: "2px solid rgba(168,85,247,0.2)", borderTop: "2px solid #a855f7", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          Cargando proyectos...
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#f87171", marginBottom: 20 }}>
          {error}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && proyectos.length === 0 && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 280, textAlign: "center", padding: 48 }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, fontSize: 32 }}>
            🗂️
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#f1f0ff", marginBottom: 8 }}>Sin proyectos aún</h2>
          <p style={{ fontSize: 14, color: "rgba(241,240,255,0.4)", maxWidth: 320, lineHeight: 1.6, marginBottom: 24 }}>
            Agrega tus proyectos para mostrarlos en tu portafolio público.
          </p>
          <button onClick={openCreate} style={btnPrimary}>+ Crear primer proyecto</button>
        </div>
      )}

      {/* Grid */}
      {!loading && proyectos.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
          {proyectos.map((p) => (
            <ProyectoCard key={p.id} proyecto={p}
              onEdit={() => openEdit(p)}
              onDelete={() => openDelete(p)}
            />
          ))}
        </div>
      )}

      {/* Modales */}
      {modal === "form" && (
        <ProyectoModal
          proyecto={selected}
          uid={user!.uid}
          onClose={closeModal}
          onSaved={load}
        />
      )}
      {modal === "delete" && selected && (
        <DeleteModal
          proyecto={selected}
          onClose={closeModal}
          onDeleted={load}
        />
      )}
    </>
  );
}