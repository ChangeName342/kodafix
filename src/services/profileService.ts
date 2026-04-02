import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage, auth } from "../firebase/config";
 
// ── Tipo ──────────────────────────────────────────────────────────────────────
 
export type ProfileData = {
  displayName:   string;
  email:         string;
  titulo:        string;
  bio:           string;
  ubicacion:     string;
  photoURL:      string;
  linkedIn:      string;
  github:        string;
};
 
const EMPTY_PROFILE: ProfileData = {
  displayName: "", email: "", titulo: "", bio: "",
  ubicacion: "", photoURL: "", linkedIn: "", github: "",
};
 
// ── Leer perfil ───────────────────────────────────────────────────────────────
 
export async function getProfile(uid: string): Promise<ProfileData> {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return EMPTY_PROFILE;
  const d = snap.data();
  return {
    displayName: d.displayName ?? "",
    email:       d.email       ?? "",
    titulo:      d.titulo      ?? "",
    bio:         d.bio         ?? "",
    ubicacion:   d.ubicacion   ?? "",
    photoURL:    d.photoURL    ?? "",
    linkedIn:    d.linkedIn    ?? "",
    github:      d.github      ?? "",
  };
}
 
// ── Guardar perfil (sin foto) ─────────────────────────────────────────────────
 
export async function saveProfile(
  uid: string,
  data: Omit<ProfileData, "email" | "photoURL">
): Promise<void> {
  await setDoc(doc(db, "users", uid), {
    displayName: data.displayName,
    titulo:      data.titulo,
    bio:         data.bio,
    ubicacion:   data.ubicacion,
    linkedIn:    data.linkedIn,
    github:      data.github,
    updatedAt:   serverTimestamp(),
  }, { merge: true });
}
 
// ── Subir foto de perfil ──────────────────────────────────────────────────────
 
export async function uploadProfilePhoto(
  uid: string,
  file: File,
  onProgress?: (pct: number) => void
): Promise<string> {
  // Valida tipo y tamaño
  if (!file.type.startsWith("image/"))
    throw new Error("El archivo debe ser una imagen.");
  if (file.size > 3 * 1024 * 1024)
    throw new Error("La imagen no puede superar 3 MB.");
 
  // Elimina la foto anterior si existe
  try {
    const oldRef = ref(storage, `profiles/${uid}/avatar`);
    await deleteObject(oldRef);
  } catch {
    // No existía — está bien
  }
 
  // Sube la nueva foto
  const storageRef = ref(storage, `profiles/${uid}/avatar`);
  const task       = uploadBytesResumable(storageRef, file, { contentType: file.type });
 
  return new Promise((resolve, reject) => {
    task.on(
      "state_changed",
      (snap) => {
        const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
        onProgress?.(pct);
      },
      (err) => reject(new Error(err.message)),
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        // Guarda la URL en Firestore
        await setDoc(doc(db, "users", uid), { photoURL: url, updatedAt: serverTimestamp() }, { merge: true });
        // Actualiza el perfil de Auth también
        const { updateProfile } = await import("firebase/auth");
        if (auth.currentUser) await updateProfile(auth.currentUser, { photoURL: url });
        resolve(url);
      }
    );
  });
}
 
// ── Validaciones ──────────────────────────────────────────────────────────────
 
export function validateProfile(data: Omit<ProfileData, "email" | "photoURL">) {
  const errors: Partial<Record<keyof ProfileData, string>> = {};
  if (!data.displayName.trim())
    errors.displayName = "El nombre es requerido.";
  if (data.titulo.length > 80)
    errors.titulo = "El título no puede superar 80 caracteres.";
  if (data.bio.length > 300)
    errors.bio = "La bio no puede superar 300 caracteres.";
  if (data.ubicacion.length > 80)
    errors.ubicacion = "La ubicación no puede superar 80 caracteres.";
  if (data.linkedIn && !/^https?:\/\/.+/.test(data.linkedIn))
    errors.linkedIn = "Ingresa una URL válida (https://...)";
  if (data.github && !/^https?:\/\/.+/.test(data.github))
    errors.github = "Ingresa una URL válida (https://...)";
  return errors;
}