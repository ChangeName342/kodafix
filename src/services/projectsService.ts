import {
  collection, doc, addDoc, updateDoc, deleteDoc,
  getDocs, query, where, serverTimestamp, orderBy,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "../firebase/config";
 
// ── Tipos ─────────────────────────────────────────────────────────────────────
 
export const TIPOS_PROYECTO = [
  "Desarrollo Web",
  "Aplicación Mobile",
  "Inteligencia Artificial",
  "Datos & Analítica",
  "Cloud & DevOps",
  "Diseño UI/UX",
  "E-commerce",
  "Automatización",
  "Otro",
] as const;
 
export type TipoProyecto = typeof TIPOS_PROYECTO[number];
 
export type ProyectoPersonal = {
  id:          string;
  uid:         string;       // dueño
  nombre:      string;
  descripcion: string;
  tipo:        TipoProyecto;
  stack:       string[];     // ["React", "Node.js", ...]
  miembros:    string[];     // nombres libres
  imageURL:    string;
  linkDemo:    string;
  linkRepo:    string;
  createdAt:   Date | null;
  updatedAt:   Date | null;
};
 
export type ProyectoForm = Omit<ProyectoPersonal, "id" | "uid" | "createdAt" | "updatedAt">;
 
export const EMPTY_FORM: ProyectoForm = {
  nombre: "", descripcion: "", tipo: "Desarrollo Web",
  stack: [], miembros: [], imageURL: "", linkDemo: "", linkRepo: "",
};
 
// ── Validación ────────────────────────────────────────────────────────────────
 
export function validateProyecto(data: ProyectoForm) {
  const errors: Partial<Record<keyof ProyectoForm, string>> = {};
  if (!data.nombre.trim())       errors.nombre      = "El nombre es requerido.";
  if (data.nombre.length > 80)   errors.nombre      = "El nombre no puede superar 80 caracteres.";
  if (!data.descripcion.trim())  errors.descripcion = "La descripción es requerida.";
  if (data.descripcion.length > 500) errors.descripcion = "La descripción no puede superar 500 caracteres.";
  if (!data.tipo)                errors.tipo        = "Selecciona un tipo de proyecto.";
  if (data.stack.length === 0)   errors.stack       = "Agrega al menos una tecnología.";
  if (data.linkDemo && !/^https?:\/\/.+/.test(data.linkDemo))
    errors.linkDemo = "Ingresa una URL válida (https://...)";
  if (data.linkRepo && !/^https?:\/\/.+/.test(data.linkRepo))
    errors.linkRepo = "Ingresa una URL válida (https://...)";
  return errors;
}
 
// ── CRUD ──────────────────────────────────────────────────────────────────────
 
export async function getProyectosPersonales(uid: string): Promise<ProyectoPersonal[]> {
  const q = query(
    collection(db, "proyectos_personales"),
    where("uid", "==", uid),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id:          d.id,
      uid:         data.uid         ?? "",
      nombre:      data.nombre      ?? "",
      descripcion: data.descripcion ?? "",
      tipo:        data.tipo        ?? "Desarrollo Web",
      stack:       data.stack       ?? [],
      miembros:    data.miembros    ?? [],
      imageURL:    data.imageURL    ?? "",
      linkDemo:    data.linkDemo    ?? "",
      linkRepo:    data.linkRepo    ?? "",
      createdAt:   data.createdAt?.toDate?.() ?? null,
      updatedAt:   data.updatedAt?.toDate?.() ?? null,
    };
  });
}
 
export async function createProyecto(uid: string, data: ProyectoForm): Promise<string> {
  const ref2 = await addDoc(collection(db, "proyectos_personales"), {
    ...data,
    uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref2.id;
}
 
export async function updateProyecto(id: string, data: Partial<ProyectoForm>): Promise<void> {
  await updateDoc(doc(db, "proyectos_personales", id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}
 
export async function deleteProyecto(id: string, imageURL: string): Promise<void> {
  // Elimina la imagen de Storage si existe
  if (imageURL) {
    try {
      const imgRef = ref(storage, imageURL);
      await deleteObject(imgRef);
    } catch { /* no existía */ }
  }
  await deleteDoc(doc(db, "proyectos_personales", id));
}
 
// ── Subir imagen del proyecto ─────────────────────────────────────────────────
 
export async function uploadProyectoImage(
  uid: string,
  proyectoId: string,
  file: File,
  onProgress?: (pct: number) => void
): Promise<string> {
  if (!file.type.startsWith("image/"))
    throw new Error("El archivo debe ser una imagen.");
  if (file.size > 5 * 1024 * 1024)
    throw new Error("La imagen no puede superar 5 MB.");
 
  const storageRef = ref(storage, `proyectos_personales/${uid}/${proyectoId}`);
  const task = uploadBytesResumable(storageRef, file, { contentType: file.type });
 
  return new Promise((resolve, reject) => {
    task.on(
      "state_changed",
      (snap) => onProgress?.(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
      (err) => reject(new Error(err.message)),
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        resolve(url);
      }
    );
  });
}