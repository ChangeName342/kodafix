import { useState, useEffect, useCallback } from "react";
import { useAuthContext } from "../../context/AuthContext";
import {
  getHabilidades, createHabilidad, updateHabilidad, deleteHabilidad,
  validateHabilidad, CATEGORIAS, NIVELES, SUGERENCIAS, EMPTY_FORM,
} from "../../services/skillsService";
import type { Habilidad, HabilidadForm, Categoria, Nivel } from "../../services/skillsService";

// ── Helpers ───────────────────────────────────────────────────────────────────

const getNivel = (v: Nivel) => NIVELES.find((n) => n.value === v)!;

const inputBase: React.CSSProperties = {
  width: "100%", padding: "10px 14px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 10, color: "#f1f0ff",
  fontSize: 14, fontFamily: "'Outfit', sans-serif", outline: "none",
};
const inputErr: React.CSSProperties = { ...inputBase, border: "1px solid rgba(239,68,68,0.5)" };
const btnPrimary: React.CSSProperties = {
  background: "linear-gradient(135deg,#7c3aed,#a855f7)", border: "none",
  color: "#fff", padding: "10px 20px", borderRadius: 9,
  fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit', sans-serif",
};
const btnGhost: React.CSSProperties = {
  background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.2)",
  color: "#a855f7", padding: "7px 14px", borderRadius: 8,
  fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit', sans-serif",
};
const btnDanger: React.CSSProperties = {
  background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
  color: "#f87171", padding: "5px 10px", borderRadius: 7,
  fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit', sans-serif",
};

// ── MODAL crear / editar ──────────────────────────────────────────────────────

function HabilidadModal({ habilidad, uid, onClose, onSaved }: {
  habilidad: Habilidad | null; uid: string;
  onClose: () => void; onSaved: () => void;
}) {
  const isEdit = !!habilidad;
  const [form, setForm]     = useState<HabilidadForm>(
    habilidad
      ? { nombre: habilidad.nombre, categoria: habilidad.categoria, nivel: habilidad.nivel }
      : { ...EMPTY_FORM }
  );
  const [errors, setErrors] = useState<Partial<Record<keyof HabilidadForm, string>>>({});
  const [loading, setLoading] = useState(false);
  const [genError, setGenError] = useState("");

  const sugerencias = SUGERENCIAS[form.categoria] ?? [];

  const setField = <K extends keyof HabilidadForm>(k: K, v: HabilidadForm[K]) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: "" }));
  };

  const handleSave = async () => {
    const errs = validateHabilidad(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true); setGenError("");
    try {
      if (isEdit) await updateHabilidad(habilidad!.id, form);
      else        await createHabilidad(uid, form);
      onSaved(); onClose();
    } catch (err: unknown) {
      setGenError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const nivelActual = getNivel(form.nivel);

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ background: "#0e0e1a", border: "1px solid rgba(168,85,247,0.2)", borderRadius: 20, padding: 32, width: "100%", maxWidth: 480 }}>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#f1f0ff" }}>
            {isEdit ? "Editar habilidad" : "Nueva habilidad"}
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(241,240,255,0.4)", fontSize: 20 }}>✕</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

          {/* Categoría */}
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "rgba(241,240,255,0.4)", marginBottom: 8, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Categoría
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {CATEGORIAS.map((cat) => (
                <button key={cat} onClick={() => setField("categoria", cat as Categoria)}
                  style={{
                    fontSize: 12, fontWeight: 600, padding: "5px 12px", borderRadius: 100, cursor: "pointer",
                    fontFamily: "'Outfit', sans-serif", transition: "all .15s",
                    background: form.categoria === cat ? "rgba(168,85,247,0.15)" : "rgba(255,255,255,0.04)",
                    border:     form.categoria === cat ? "1px solid rgba(168,85,247,0.4)" : "1px solid rgba(255,255,255,0.08)",
                    color:      form.categoria === cat ? "#a855f7" : "rgba(241,240,255,0.4)",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Nombre con sugerencias */}
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "rgba(241,240,255,0.4)", marginBottom: 8, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Tecnología / Herramienta
            </label>
            <input type="text" value={form.nombre} placeholder="Ej: React, Python, Docker..."
              onChange={(e) => setField("nombre", e.target.value)}
              style={errors.nombre ? inputErr : inputBase}
            />
            {errors.nombre && <span style={{ fontSize: 11, color: "#f87171", marginTop: 4, display: "block" }}>{errors.nombre}</span>}

            {/* Sugerencias rápidas */}
            {sugerencias.length > 0 && (
              <div style={{ marginTop: 8 }}>
                <p style={{ fontSize: 11, color: "rgba(241,240,255,0.25)", marginBottom: 6 }}>Sugerencias:</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {sugerencias.map((s) => (
                    <button key={s} onClick={() => setField("nombre", s)}
                      style={{
                        fontSize: 11, padding: "3px 9px", borderRadius: 100,
                        background: form.nombre === s ? "rgba(168,85,247,0.15)" : "rgba(255,255,255,0.03)",
                        border: form.nombre === s ? "1px solid rgba(168,85,247,0.3)" : "1px solid rgba(255,255,255,0.06)",
                        color: form.nombre === s ? "#a855f7" : "rgba(241,240,255,0.35)",
                        cursor: "pointer", fontFamily: "'Outfit', sans-serif",
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Nivel */}
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "rgba(241,240,255,0.4)", marginBottom: 8, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Nivel
            </label>
            <div style={{ display: "flex", gap: 8 }}>
              {NIVELES.map((n) => (
                <button key={n.value} onClick={() => setField("nivel", n.value as Nivel)}
                  style={{
                    flex: 1, padding: "9px 4px", borderRadius: 9, fontSize: 12, fontWeight: 600,
                    cursor: "pointer", fontFamily: "'Outfit', sans-serif", transition: "all .15s",
                    background: form.nivel === n.value ? `${n.color}18` : "rgba(255,255,255,0.04)",
                    border:     form.nivel === n.value ? `1px solid ${n.color}50` : "1px solid rgba(255,255,255,0.08)",
                    color:      form.nivel === n.value ? n.color : "rgba(241,240,255,0.35)",
                  }}
                >
                  {n.label}
                </button>
              ))}
            </div>

            {/* Barra de preview del nivel */}
            <div style={{ marginTop: 10, height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${nivelActual.pct}%`, background: nivelActual.color, borderRadius: 4, transition: "width .35s ease" }} />
            </div>
            <p style={{ fontSize: 11, color: nivelActual.color, marginTop: 5, fontWeight: 600 }}>{nivelActual.label} — {nivelActual.pct}%</p>
          </div>

          {genError && <p style={{ fontSize: 12, color: "#f87171" }}>{genError}</p>}

          <button onClick={handleSave} disabled={loading}
            style={{ ...btnPrimary, width: "100%", padding: "12px", fontSize: 15, opacity: loading ? 0.6 : 1, cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? "Guardando..." : isEdit ? "Guardar cambios" : "Agregar habilidad"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── TARJETA de habilidad ──────────────────────────────────────────────────────

function HabilidadCard({ h, onEdit, onDelete }: {
  h: Habilidad; onEdit: () => void; onDelete: () => void;
}) {
  const nivel = getNivel(h.nivel);
  return (
    <div style={{
      background: "#0e0e1a", border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 12, padding: "14px 16px",
      display: "flex", alignItems: "center", gap: 14,
      transition: "border-color .2s, transform .2s",
    }}
      onMouseEnter={(e) => { const d = e.currentTarget as HTMLDivElement; d.style.borderColor = `${nivel.color}30`; d.style.transform = "translateY(-1px)"; }}
      onMouseLeave={(e) => { const d = e.currentTarget as HTMLDivElement; d.style.borderColor = "rgba(255,255,255,0.06)"; d.style.transform = ""; }}
    >
      {/* Nombre + barra */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#f1f0ff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {h.nombre}
          </span>
          <span style={{ fontSize: 11, fontWeight: 600, color: nivel.color, marginLeft: 8, whiteSpace: "nowrap" }}>
            {nivel.label}
          </span>
        </div>
        {/* Barra de nivel */}
        <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${nivel.pct}%`, background: nivel.color, borderRadius: 3 }} />
        </div>
      </div>

      {/* Acciones */}
      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
        <button onClick={onEdit}   style={btnGhost}  title="Editar">✏️</button>
        <button onClick={onDelete} style={btnDanger} title="Eliminar">✕</button>
      </div>
    </div>
  );
}

// ── SECCIÓN PRINCIPAL ─────────────────────────────────────────────────────────

export default function SectionHabilidades() {
  const { user } = useAuthContext();
  const [habilidades, setHabilidades] = useState<Habilidad[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [modal, setModal]       = useState<"form" | "delete" | null>(null);
  const [selected, setSelected] = useState<Habilidad | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true); setError("");
    try {
      setHabilidades(await getHabilidades(user.uid));
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setSelected(null); setModal("form"); };
  const openEdit   = (h: Habilidad) => { setSelected(h); setModal("form"); };
  const openDelete = (h: Habilidad) => { setSelected(h); setModal("delete"); };
  const closeModal = () => { setModal(null); setSelected(null); };

  // Agrupar por categoría
  const grouped = habilidades.reduce<Record<string, Habilidad[]>>((acc, h) => {
    (acc[h.categoria] ??= []).push(h);
    return acc;
  }, {});

  const totalByNivel = NIVELES.map((n) => ({
    ...n,
    count: habilidades.filter((h) => h.nivel === n.value).length,
  }));

  return (
    <>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#f1f0ff", letterSpacing: -0.5, marginBottom: 4 }}>
            Habilidades técnicas
          </h1>
          <p style={{ fontSize: 14, color: "rgba(241,240,255,0.4)" }}>
            {habilidades.length > 0 ? `${habilidades.length} habilidad${habilidades.length > 1 ? "es" : ""}` : "Muestra tu stack tecnológico"}
          </p>
        </div>
        <button onClick={openCreate} style={btnPrimary}>+ Nueva habilidad</button>
      </div>

      {loading && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 24, color: "rgba(241,240,255,0.4)", fontSize: 14 }}>
          <div style={{ width: 20, height: 20, border: "2px solid rgba(168,85,247,0.2)", borderTop: "2px solid #a855f7", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          Cargando habilidades...
        </div>
      )}

      {error && (
        <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#f87171", marginBottom: 20 }}>
          {error}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && habilidades.length === 0 && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 280, textAlign: "center", padding: 48 }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, fontSize: 32 }}>
            ⚡
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#f1f0ff", marginBottom: 8 }}>Sin habilidades aún</h2>
          <p style={{ fontSize: 14, color: "rgba(241,240,255,0.4)", maxWidth: 320, lineHeight: 1.6, marginBottom: 24 }}>
            Agrega las tecnologías y herramientas que dominas.
          </p>
          <button onClick={openCreate} style={btnPrimary}>+ Agregar primera habilidad</button>
        </div>
      )}

      {!loading && habilidades.length > 0 && (
        <>
          {/* Resumen por nivel */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 32 }}>
            {totalByNivel.filter((n) => n.count > 0).map((n) => (
              <div key={n.value} style={{ background: `${n.color}08`, border: `1px solid ${n.color}20`, borderRadius: 12, padding: "14px 16px" }}>
                <div style={{ fontSize: 26, fontWeight: 800, color: n.color, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1, marginBottom: 4 }}>
                  {n.count}
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(241,240,255,0.4)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  {n.label}
                </div>
                {/* Mini barra */}
                <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden", marginTop: 8 }}>
                  <div style={{ height: "100%", width: `${n.pct}%`, background: n.color, borderRadius: 3 }} />
                </div>
              </div>
            ))}
          </div>

          {/* Habilidades agrupadas por categoría */}
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {CATEGORIAS.filter((cat) => grouped[cat]?.length).map((cat) => (
              <div key={cat}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <h2 style={{ fontSize: 13, fontWeight: 700, color: "rgba(241,240,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    {cat}
                  </h2>
                  <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }} />
                  <span style={{ fontSize: 11, color: "rgba(241,240,255,0.25)" }}>{grouped[cat].length}</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
                  {grouped[cat].map((h) => (
                    <HabilidadCard key={h.id} h={h}
                      onEdit={() => openEdit(h)}
                      onDelete={() => openDelete(h)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modal form */}
      {modal === "form" && (
        <HabilidadModal
          habilidad={selected}
          uid={user!.uid}
          onClose={closeModal}
          onSaved={load}
        />
      )}

      {/* Modal delete */}
      {modal === "delete" && selected && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div style={{ background: "#0e0e1a", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 20, padding: 32, width: "100%", maxWidth: 400 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "#f1f0ff", marginBottom: 12 }}>Eliminar habilidad</h2>
            <p style={{ fontSize: 14, color: "rgba(241,240,255,0.6)", marginBottom: 24, lineHeight: 1.6 }}>
              ¿Eliminar <strong style={{ color: "#f1f0ff" }}>{selected.nombre}</strong>?
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={closeModal} style={{ ...btnGhost, flex: 1 }}>Cancelar</button>
              <button
                onClick={async () => {
                  await deleteHabilidad(selected.id);
                  load(); closeModal();
                }}
                style={{ ...btnDanger, flex: 1, padding: "10px" }}
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
