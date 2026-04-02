import { useState, useEffect, useRef } from "react";
import { useAuthContext } from "../../context/AuthContext";
import {
  getProfile, saveProfile, uploadProfilePhoto, validateProfile,
} from "../../services/profileService";
import type { ProfileData } from "../../services/profileService";

// ── Estilos base ──────────────────────────────────────────────────────────────

const inputBase: React.CSSProperties = {
  width: "100%", padding: "10px 14px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 10, color: "#f1f0ff",
  fontSize: 14, fontFamily: "'Outfit', sans-serif", outline: "none",
  transition: "border-color .2s",
};
const inputErr: React.CSSProperties = { ...inputBase, border: "1px solid rgba(239,68,68,0.5)" };

function Field({ label, hint, error, children }: {
  label: string; hint?: string; error?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 7 }}>
        <label style={{ fontSize: 11, fontWeight: 600, color: "rgba(241,240,255,0.4)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
          {label}
        </label>
        {hint && <span style={{ fontSize: 11, color: "rgba(241,240,255,0.25)" }}>{hint}</span>}
      </div>
      {children}
      {error && <span style={{ fontSize: 11, color: "#f87171", marginTop: 4, display: "block" }}>{error}</span>}
    </div>
  );
}

// ── Avatar uploader ───────────────────────────────────────────────────────────

function AvatarUploader({ uid, photoURL, displayName, onUploaded }: {
  uid: string; photoURL: string; displayName: string;
  onUploaded: (url: string) => void;
}) {
  const fileRef             = useRef<HTMLInputElement>(null);
  const [progress, setProg] = useState<number | null>(null);
  const [error, setError]   = useState("");
  const [preview, setPreview] = useState(photoURL);

  useEffect(() => { setPreview(photoURL); }, [photoURL]);

  const initials = displayName.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");

    // Preview local inmediato
    const localURL = URL.createObjectURL(file);
    setPreview(localURL);

    try {
      const url = await uploadProfilePhoto(uid, file, setProg);
      onUploaded(url);
    } catch (err: unknown) {
      setError((err as Error).message);
      setPreview(photoURL);
    } finally {
      setProg(null);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "20px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", marginBottom: 24 }}>
      {/* Avatar */}
      <div style={{ position: "relative", flexShrink: 0 }}>
        <div style={{ width: 84, height: 84, borderRadius: "50%", overflow: "hidden", background: "linear-gradient(135deg,#3b0764,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 800, color: "#ede9fe", border: "2px solid rgba(168,85,247,0.3)" }}>
          {preview
            ? <img src={preview} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : initials
          }
        </div>

        {/* Progreso circular */}
        {progress !== null && (
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#a855f7" }}>{progress}%</span>
          </div>
        )}
      </div>

      {/* Botón + info */}
      <div>
        <button
          onClick={() => fileRef.current?.click()}
          disabled={progress !== null}
          style={{
            background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.25)",
            color: "#a855f7", padding: "8px 16px", borderRadius: 9,
            fontSize: 13, fontWeight: 600, cursor: progress !== null ? "not-allowed" : "pointer",
            fontFamily: "'Outfit', sans-serif", marginBottom: 6, opacity: progress !== null ? 0.6 : 1,
          }}
        >
          {progress !== null ? `Subiendo ${progress}%...` : "Cambiar foto"}
        </button>
        <p style={{ fontSize: 12, color: "rgba(241,240,255,0.3)", lineHeight: 1.5 }}>
          JPG, PNG o WebP · Máximo 3 MB
        </p>
        {error && <p style={{ fontSize: 12, color: "#f87171", marginTop: 4 }}>{error}</p>}
        <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
      </div>
    </div>
  );
}

// ── Sección principal ─────────────────────────────────────────────────────────

export default function SectionPerfil() {
  const { user } = useAuthContext();

  const [form, setForm]       = useState<Omit<ProfileData, "email" | "photoURL">>({
    displayName: "", titulo: "", bio: "", ubicacion: "", linkedIn: "", github: "",
  });
  const [photoURL, setPhotoURL] = useState("");
  const [errors, setErrors]   = useState<Partial<Record<keyof ProfileData, string>>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    if (!user) return;
    getProfile(user.uid).then((p) => {
      setForm({
        displayName: p.displayName || user.displayName || "",
        titulo:      p.titulo,
        bio:         p.bio,
        ubicacion:   p.ubicacion,
        linkedIn:    p.linkedIn,
        github:      p.github,
      });
      setPhotoURL(p.photoURL);
      setLoading(false);
    });
  }, [user]);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    setSaved(false);
  };

  const handleSave = async () => {
    if (!user) return;
    const errs = validateProfile(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSaving(true); setSaveError(""); setSaved(false);
    try {
      await saveProfile(user.uid, form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: unknown) {
      setSaveError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 32, color: "rgba(241,240,255,0.4)", fontSize: 14 }}>
      <div style={{ width: 20, height: 20, border: "2px solid rgba(168,85,247,0.2)", borderTop: "2px solid #a855f7", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      Cargando perfil...
    </div>
  );

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: "#f1f0ff", letterSpacing: -0.5, marginBottom: 4 }}>Mi perfil</h1>
      <p style={{ fontSize: 14, color: "rgba(241,240,255,0.4)", marginBottom: 28 }}>
        Tu información pública en KodaFix.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24, alignItems: "start" }}>

        {/* Formulario */}
        <div style={{ background: "#0e0e1a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 28 }}>

          {/* Avatar */}
          <AvatarUploader
            uid={user!.uid}
            photoURL={photoURL}
            displayName={form.displayName || user?.displayName || ""}
            onUploaded={(url) => { setPhotoURL(url); setSaved(false); }}
          />

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

            <Field label="Nombre completo" error={errors.displayName}>
              <input
                type="text" value={form.displayName} placeholder="Tu nombre completo"
                onChange={(e) => handleChange("displayName", e.target.value)}
                style={errors.displayName ? inputErr : inputBase}
              />
            </Field>

            <Field label="Correo electrónico">
              <input type="email" value={user?.email ?? ""} disabled
                style={{ ...inputBase, opacity: 0.45, cursor: "not-allowed" }}
              />
            </Field>

            <Field label="Título profesional" hint="máx. 80 car." error={errors.titulo}>
              <input
                type="text" value={form.titulo}
                placeholder="Ej: Desarrollador Full Stack"
                onChange={(e) => handleChange("titulo", e.target.value)}
                style={errors.titulo ? inputErr : inputBase}
              />
            </Field>

            <Field label="Bio" hint={`${form.bio.length}/300`} error={errors.bio}>
              <textarea
                value={form.bio} rows={3}
                placeholder="Ej: Desarrollador con experiencia en React, enfocado en crear interfaces modernas…"
                onChange={(e) => handleChange("bio", e.target.value)}
                style={{ ...( errors.bio ? inputErr : inputBase), resize: "vertical", minHeight: 90 }}
              />
            </Field>

            <Field label="Ubicación" hint="máx. 80 car." error={errors.ubicacion}>
              <input
                type="text" value={form.ubicacion}
                placeholder="Ej: Santiago, Chile"
                onChange={(e) => handleChange("ubicacion", e.target.value)}
                style={errors.ubicacion ? inputErr : inputBase}
              />
            </Field>

            <Field label="LinkedIn" error={errors.linkedIn}>
              <input
                type="url" value={form.linkedIn}
                placeholder="https://linkedin.com/in/tu-perfil"
                onChange={(e) => handleChange("linkedIn", e.target.value)}
                style={errors.linkedIn ? inputErr : inputBase}
              />
            </Field>

            <Field label="GitHub" error={errors.github}>
              <input
                type="url" value={form.github}
                placeholder="https://github.com/tu-usuario"
                onChange={(e) => handleChange("github", e.target.value)}
                style={errors.github ? inputErr : inputBase}
              />
            </Field>

            {saveError && (
              <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#f87171" }}>
                {saveError}
              </div>
            )}

            <button
              onClick={handleSave} disabled={saving}
              style={{
                background: saved
                  ? "linear-gradient(135deg,#059669,#10b981)"
                  : "linear-gradient(135deg,#7c3aed,#a855f7)",
                border: "none", color: "#fff", padding: "12px",
                borderRadius: 10, fontSize: 15, fontWeight: 700,
                cursor: saving ? "not-allowed" : "pointer",
                fontFamily: "'Outfit', sans-serif", transition: "all .3s",
                opacity: saving ? 0.6 : 1,
              }}
            >
              {saving ? "Guardando..." : saved ? "✓ Cambios guardados" : "Guardar cambios"}
            </button>
          </div>
        </div>

        {/* Preview */}
        <div style={{ background: "#0e0e1a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 28 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(241,240,255,0.3)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20 }}>
            Vista previa
          </p>

          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", overflow: "hidden", background: "linear-gradient(135deg,#3b0764,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 800, color: "#ede9fe", margin: "0 auto 14px", border: "2px solid rgba(168,85,247,0.3)" }}>
              {photoURL
                ? <img src={photoURL} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : (form.displayName || "?").split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
              }
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "#f1f0ff", marginBottom: 4 }}>
              {form.displayName || <span style={{ color: "rgba(241,240,255,0.25)" }}>Tu nombre</span>}
            </h2>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#a855f7", marginBottom: 6 }}>
              {form.titulo || <span style={{ color: "rgba(241,240,255,0.2)" }}>Título profesional</span>}
            </p>
            {form.ubicacion && (
              <p style={{ fontSize: 12, color: "rgba(241,240,255,0.4)", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {form.ubicacion}
              </p>
            )}
          </div>

          {form.bio && (
            <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "14px 16px", marginBottom: 16 }}>
              <p style={{ fontSize: 13, color: "rgba(241,240,255,0.55)", lineHeight: 1.65, margin: 0 }}>{form.bio}</p>
            </div>
          )}

          {(form.linkedIn || form.github) && (
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {form.linkedIn && (
                <a href={form.linkedIn} target="_blank" rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#06b6d4", background: "rgba(6,182,212,0.08)", border: "1px solid rgba(6,182,212,0.2)", borderRadius: 8, padding: "6px 12px", textDecoration: "none", fontWeight: 600 }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                  LinkedIn
                </a>
              )}
              {form.github && (
                <a href={form.github} target="_blank" rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#a855f7", background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.2)", borderRadius: 8, padding: "6px 12px", textDecoration: "none", fontWeight: 600 }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
                  GitHub
                </a>
              )}
            </div>
          )}

          {!form.displayName && !form.titulo && !form.bio && !form.ubicacion && (
            <p style={{ fontSize: 13, color: "rgba(241,240,255,0.2)", textAlign: "center", marginTop: 12 }}>
              Completa el formulario para ver la vista previa
            </p>
          )}
        </div>

      </div>
    </div>
  );
}