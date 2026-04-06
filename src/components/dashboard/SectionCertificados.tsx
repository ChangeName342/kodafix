import { useState, useEffect, useRef, useCallback } from "react";
import { useAuthContext } from "../../context/AuthContext";
import {
  getCertificados, createCertificado, updateCertificado,
  deleteCertificado, uploadCertificadoFile, validateCertificado,
  formatFecha, EMPTY_FORM,
} from "../../services/certificatesService";
import type { Certificado, CertificadoForm } from "../../services/certificatesService";

// ── Estilos base ──────────────────────────────────────────────────────────────

const inputBase: React.CSSProperties = {
  width: "100%", padding: "10px 14px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 10, color: "#f1f0ff",
  fontSize: 14, fontFamily: "'Outfit', sans-serif", outline: "none",
};
const inputErr: React.CSSProperties  = { ...inputBase, border: "1px solid rgba(239,68,68,0.5)" };
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
  color: "#f87171", padding: "7px 14px", borderRadius: 8,
  fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit', sans-serif",
};

function Field({ label, optional, error, children }: {
  label: string; optional?: boolean; error?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <div style={{ display: "flex", gap: 6, alignItems: "baseline", marginBottom: 7 }}>
        <label style={{ fontSize: 11, fontWeight: 600, color: "rgba(241,240,255,0.4)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
          {label}
        </label>
        {optional && (
          <span style={{ fontSize: 10, color: "rgba(241,240,255,0.2)", fontStyle: "italic" }}>opcional</span>
        )}
      </div>
      {children}
      {error && <span style={{ fontSize: 11, color: "#f87171", marginTop: 4, display: "block" }}>{error}</span>}
    </div>
  );
}

// ── File uploader ─────────────────────────────────────────────────────────────

function FileUploader({ preview, fileType, onFile, progress, onRemove }: {
  preview: string; fileType: "image" | "pdf" | "";
  onFile: (f: File) => void; progress: number | null;
  onRemove: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      {/* Zona de drop / preview */}
      <div
        onClick={() => !preview && fileRef.current?.click()}
        style={{
          width: "100%", height: preview ? "auto" : 120, borderRadius: 12,
          border: `2px dashed ${preview ? "rgba(168,85,247,0.35)" : "rgba(168,85,247,0.2)"}`,
          background: "rgba(168,85,247,0.03)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: preview ? "default" : "pointer", overflow: "hidden",
          position: "relative", transition: "border-color .2s",
          minHeight: 80,
        }}
        onMouseEnter={(e) => { if (!preview) (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(168,85,247,0.5)"; }}
        onMouseLeave={(e) => { if (!preview) (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(168,85,247,0.2)"; }}
      >
        {progress !== null ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: 20 }}>
            <div style={{ width: 36, height: 36, border: "3px solid rgba(168,85,247,0.2)", borderTop: "3px solid #a855f7", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            <span style={{ fontSize: 13, color: "#a855f7", fontWeight: 600 }}>Subiendo {progress}%...</span>
          </div>
        ) : preview && fileType === "image" ? (
          <img src={preview} alt="certificado" style={{ width: "100%", maxHeight: 220, objectFit: "contain", padding: 8 }} />
        ) : preview && fileType === "pdf" ? (
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 20px", width: "100%" }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#f1f0ff", margin: 0 }}>Archivo PDF cargado</p>
              <a href={preview} target="_blank" rel="noopener noreferrer"
                style={{ fontSize: 12, color: "#a855f7", textDecoration: "none" }}
              >
                Ver archivo →
              </a>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: 20, pointerEvents: "none" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(168,85,247,0.4)" strokeWidth="1.5" strokeLinecap="round" style={{ marginBottom: 8 }}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            <p style={{ fontSize: 13, color: "rgba(241,240,255,0.3)", margin: 0 }}>Haz clic para subir</p>
            <p style={{ fontSize: 11, color: "rgba(241,240,255,0.18)", margin: "4px 0 0" }}>JPG, PNG, WebP o PDF · Máx. 10 MB</p>
          </div>
        )}
      </div>

      {/* Botones debajo */}
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <button type="button" onClick={() => fileRef.current?.click()}
          style={{ ...btnGhost, fontSize: 11 }}
        >
          {preview ? "Cambiar archivo" : "Seleccionar archivo"}
        </button>
        {preview && (
          <button type="button" onClick={onRemove} style={{ ...btnDanger, fontSize: 11 }}>
            Quitar archivo
          </button>
        )}
      </div>

      <input ref={fileRef} type="file" accept="image/*,application/pdf" style={{ display: "none" }}
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); e.target.value = ""; }}
      />
    </div>
  );
}

// ── MODAL crear / editar ──────────────────────────────────────────────────────

function CertModal({ cert, uid, onClose, onSaved }: {
  cert: Certificado | null; uid: string;
  onClose: () => void; onSaved: () => void;
}) {
  const isEdit = !!cert;
  const [form, setForm]         = useState<CertificadoForm>(
    cert
      ? { nombre: cert.nombre, institucion: cert.institucion, fecha: cert.fecha, fileURL: cert.fileURL, fileType: cert.fileType }
      : { ...EMPTY_FORM }
  );
  const [preview, setPreview]   = useState(cert?.fileURL ?? "");
  const [pendingFile, setPending] = useState<File | null>(null);
  const [uploadPct, setUploadPct] = useState<number | null>(null);
  const [errors, setErrors]     = useState<Partial<Record<keyof CertificadoForm, string>>>({});
  const [loading, setLoading]   = useState(false);
  const [genError, setGenError] = useState("");

  const setField = <K extends keyof CertificadoForm>(k: K, v: CertificadoForm[K]) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: "" }));
  };

  const handleFile = (file: File) => {
    setPending(file);
    if (file.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(file));
      setForm((p) => ({ ...p, fileType: "image" }));
    } else {
      setPreview("pdf-pending");
      setForm((p) => ({ ...p, fileType: "pdf" }));
    }
  };

  const handleRemoveFile = () => {
    setPending(null);
    setPreview("");
    setForm((p) => ({ ...p, fileURL: "", fileType: "" }));
  };

  const handleSave = async () => {
    const errs = validateCertificado(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true); setGenError("");
    try {
      let fileURL  = form.fileURL;
      let fileType = form.fileType;

      if (isEdit) {
        if (pendingFile) {
          const result = await uploadCertificadoFile(uid, cert!.id, pendingFile, setUploadPct);
          fileURL = result.url; fileType = result.fileType;
          setUploadPct(null);
        }
        await updateCertificado(cert!.id, { nombre: form.nombre, institucion: form.institucion, fecha: form.fecha, fileURL, fileType });
      } else {
        const newId = await createCertificado(uid, { ...form, fileURL: "", fileType: "" });
        if (pendingFile) {
          const result = await uploadCertificadoFile(uid, newId, pendingFile, setUploadPct);
          fileURL = result.url; fileType = result.fileType;
          setUploadPct(null);
          await updateCertificado(newId, { fileURL, fileType });
        }
      }

      onSaved(); onClose();
    } catch (err: unknown) {
      setGenError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const previewSrc = preview === "pdf-pending" ? "" : preview;
  const previewType: "image" | "pdf" | "" = preview === "pdf-pending" ? "pdf" : form.fileType;

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 300, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "24px 16px", background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)", overflowY: "auto" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ background: "#0e0e1a", border: "1px solid rgba(168,85,247,0.2)", borderRadius: 20, padding: 32, width: "100%", maxWidth: 500, marginBottom: 24 }}>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#f1f0ff" }}>
            {isEdit ? "Editar certificado" : "Nuevo certificado"}
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(241,240,255,0.4)", fontSize: 20 }}>✕</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          <Field label="Nombre del certificado" error={errors.nombre}>
            <input type="text" value={form.nombre}
              placeholder="Ej: Certificado React Avanzado"
              onChange={(e) => setField("nombre", e.target.value)}
              style={errors.nombre ? inputErr : inputBase}
            />
          </Field>

          <Field label="Institución" error={errors.institucion}>
            <input type="text" value={form.institucion}
              placeholder="Ej: Udemy, Platzi, Coursera, LinkedIn Learning..."
              onChange={(e) => setField("institucion", e.target.value)}
              style={errors.institucion ? inputErr : inputBase}
            />
          </Field>

          <Field label="Fecha de obtención" error={errors.fecha}>
            <input type="month" value={form.fecha}
              onChange={(e) => setField("fecha", e.target.value)}
              style={errors.fecha ? inputErr : inputBase}
              max={new Date().toISOString().slice(0, 7)}
            />
          </Field>

          <Field label="Archivo del certificado" optional>
            <FileUploader
              preview={previewSrc}
              fileType={previewType}
              onFile={handleFile}
              progress={uploadPct}
              onRemove={handleRemoveFile}
            />
          </Field>

          {genError && (
            <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#f87171" }}>
              {genError}
            </div>
          )}

          <button onClick={handleSave} disabled={loading}
            style={{ ...btnPrimary, width: "100%", padding: "12px", fontSize: 15, opacity: loading ? 0.6 : 1, cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading
              ? uploadPct !== null ? `Subiendo archivo ${uploadPct}%...` : "Guardando..."
              : isEdit ? "Guardar cambios" : "Agregar certificado"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── TARJETA ───────────────────────────────────────────────────────────────────

function CertCard({ cert, onEdit, onDelete }: {
  cert: Certificado; onEdit: () => void; onDelete: () => void;
}) {
  return (
    <div style={{
      background: "#0e0e1a", border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 16, overflow: "hidden", display: "flex", flexDirection: "column",
      transition: "border-color .2s, transform .2s",
    }}
      onMouseEnter={(e) => { const d = e.currentTarget as HTMLDivElement; d.style.borderColor = "rgba(168,85,247,0.25)"; d.style.transform = "translateY(-2px)"; }}
      onMouseLeave={(e) => { const d = e.currentTarget as HTMLDivElement; d.style.borderColor = "rgba(255,255,255,0.06)"; d.style.transform = ""; }}
    >
      {/* Preview del archivo */}
      {cert.fileURL && cert.fileType === "image" && (
        <a href={cert.fileURL} target="_blank" rel="noopener noreferrer" style={{ display: "block", height: 140, overflow: "hidden" }}>
          <img src={cert.fileURL} alt={cert.nombre} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .3s" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.04)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "")}
          />
        </a>
      )}

      {cert.fileURL && cert.fileType === "pdf" && (
        <a href={cert.fileURL} target="_blank" rel="noopener noreferrer"
          style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", background: "rgba(239,68,68,0.05)", borderBottom: "1px solid rgba(239,68,68,0.1)", textDecoration: "none" }}
        >
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(239,68,68,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
          </div>
          <span style={{ fontSize: 12, color: "#f87171", fontWeight: 600 }}>Ver certificado PDF →</span>
        </a>
      )}

      {/* Sin archivo */}
      {!cert.fileURL && (
        <div style={{ height: 56, background: "rgba(168,85,247,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(168,85,247,0.3)" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="12" cy="8" r="6"/>
            <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
          </svg>
        </div>
      )}

      {/* Info */}
      <div style={{ padding: "16px 16px 12px", flex: 1, display: "flex", flexDirection: "column" }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: "#f1f0ff", marginBottom: 6, lineHeight: 1.4 }}>
          {cert.nombre}
        </h3>

        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(168,85,247,0.6)" strokeWidth="2" strokeLinecap="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          </svg>
          <span style={{ fontSize: 12, color: "rgba(241,240,255,0.55)", fontWeight: 500 }}>{cert.institucion}</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(241,240,255,0.25)" strokeWidth="2" strokeLinecap="round">
            <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <span style={{ fontSize: 12, color: "rgba(241,240,255,0.35)" }}>{formatFecha(cert.fecha)}</span>
        </div>

        {/* Acciones */}
        <div style={{ display: "flex", gap: 8, borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 12 }}>
          <button onClick={onEdit}   style={{ ...btnGhost,  flex: 1, textAlign: "center" as const }}>Editar</button>
          <button onClick={onDelete} style={{ ...btnDanger, flex: 1, textAlign: "center" as const }}>Eliminar</button>
        </div>
      </div>
    </div>
  );
}

// ── SECCIÓN PRINCIPAL ─────────────────────────────────────────────────────────

export default function SectionCertificados() {
  const { user } = useAuthContext();
  const [certs, setCerts]     = useState<Certificado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [modal, setModal]     = useState<"form" | "delete" | null>(null);
  const [selected, setSelected] = useState<Certificado | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true); setError("");
    try {
      setCerts(await getCertificados(user.uid));
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setSelected(null); setModal("form"); };
  const openEdit   = (c: Certificado) => { setSelected(c); setModal("form"); };
  const openDelete = (c: Certificado) => { setSelected(c); setModal("delete"); };
  const closeModal = () => { setModal(null); setSelected(null); };

  return (
    <>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#f1f0ff", letterSpacing: -0.5, marginBottom: 4 }}>Certificados</h1>
          <p style={{ fontSize: 14, color: "rgba(241,240,255,0.4)" }}>
            {certs.length > 0 ? `${certs.length} certificado${certs.length > 1 ? "s" : ""}` : "Agrega tus certificaciones profesionales"}
          </p>
        </div>
        <button onClick={openCreate} style={btnPrimary}>+ Nuevo certificado</button>
      </div>

      {loading && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 24, color: "rgba(241,240,255,0.4)", fontSize: 14 }}>
          <div style={{ width: 20, height: 20, border: "2px solid rgba(168,85,247,0.2)", borderTop: "2px solid #a855f7", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          Cargando certificados...
        </div>
      )}

      {error && (
        <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#f87171", marginBottom: 20 }}>
          {error}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && certs.length === 0 && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 280, textAlign: "center", padding: 48 }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: "rgba(234,179,8,0.08)", border: "1px solid rgba(234,179,8,0.2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, fontSize: 32 }}>
            🏆
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#f1f0ff", marginBottom: 8 }}>Sin certificados aún</h2>
          <p style={{ fontSize: 14, color: "rgba(241,240,255,0.4)", maxWidth: 320, lineHeight: 1.6, marginBottom: 24 }}>
            Agrega tus certificaciones de Udemy, Platzi, Coursera y más.
          </p>
          <button onClick={openCreate} style={btnPrimary}>+ Agregar primer certificado</button>
        </div>
      )}

      {/* Grid */}
      {!loading && certs.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 18 }}>
          {certs.map((c) => (
            <CertCard key={c.id} cert={c}
              onEdit={() => openEdit(c)}
              onDelete={() => openDelete(c)}
            />
          ))}
        </div>
      )}

      {/* Modal form */}
      {modal === "form" && (
        <CertModal cert={selected} uid={user!.uid} onClose={closeModal} onSaved={load} />
      )}

      {/* Modal delete */}
      {modal === "delete" && selected && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div style={{ background: "#0e0e1a", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 20, padding: 32, width: "100%", maxWidth: 400 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "#f1f0ff", marginBottom: 12 }}>Eliminar certificado</h2>
            <p style={{ fontSize: 14, color: "rgba(241,240,255,0.6)", marginBottom: 8, lineHeight: 1.6 }}>
              ¿Eliminar <strong style={{ color: "#f1f0ff" }}>{selected.nombre}</strong>?
            </p>
            <p style={{ fontSize: 13, color: "rgba(239,68,68,0.6)", marginBottom: 24 }}>
              {selected.fileURL ? "Se eliminará el certificado y su archivo adjunto." : "Esta acción no se puede deshacer."}
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={closeModal} style={{ ...btnGhost, flex: 1 }}>Cancelar</button>
              <button
                onClick={async () => {
                  await deleteCertificado(selected.id, selected.fileURL);
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
