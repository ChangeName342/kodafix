import {
  collection, doc, addDoc, updateDoc, deleteDoc,
  getDocs, query, where, serverTimestamp, orderBy,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "../firebase/config";
 
// ── Tipo ──────────────────────────────────────────────────────────────────────
 
export type Certificado = {
  id:          string;
  uid:         string;
  nombre:      string;
  institucion: string;
  fecha:       string;   // "YYYY-MM"
  fileURL:     string;   // puede ser vacío
  fileType:    "image" | "pdf" | "";
  createdAt:   Date | null;
};
 
export type CertificadoForm = Omit<Certificado, "id" | "uid" | "createdAt">;
 
export const EMPTY_FORM: CertificadoForm = {
  nombre: "", institucion: "", fecha: "", fileURL: "", fileType: "",
};
 
// ── Validación ────────────────────────────────────────────────────────────────
 
export function validateCertificado(data: CertificadoForm) {
  const errors: Partial<Record<keyof CertificadoForm, string>> = {};
  if (!data.nombre.trim())      errors.nombre      = "El nombre es requerido.";
  if (data.nombre.length > 100) errors.nombre      = "Máximo 100 caracteres.";
  if (!data.institucion.trim()) errors.institucion = "La institución es requerida.";
  if (!data.fecha)              errors.fecha       = "La fecha es requerida.";
  return errors;
}
 
// ── CRUD ──────────────────────────────────────────────────────────────────────
 
export async function getCertificados(uid: string): Promise<Certificado[]> {
  const q = query(
    collection(db, "certificados"),
    where("uid", "==", uid),
    orderBy("fecha", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id:          d.id,
      uid:         data.uid          ?? "",
      nombre:      data.nombre       ?? "",
      institucion: data.institucion  ?? "",
      fecha:       data.fecha        ?? "",
      fileURL:     data.fileURL      ?? "",
      fileType:    data.fileType     ?? "",
      createdAt:   data.createdAt?.toDate?.() ?? null,
    };
  });
}
 
export async function createCertificado(uid: string, data: CertificadoForm): Promise<string> {
  const ref2 = await addDoc(collection(db, "certificados"), {
    ...data, uid, createdAt: serverTimestamp(),
  });
  return ref2.id;
}
 
export async function updateCertificado(id: string, data: Partial<CertificadoForm>): Promise<void> {
  await updateDoc(doc(db, "certificados", id), data);
}
 
export async function deleteCertificado(id: string, fileURL: string): Promise<void> {
  if (fileURL) {
    try { await deleteObject(ref(storage, fileURL)); } catch { /* no existía */ }
  }
  await deleteDoc(doc(db, "certificados", id));
}
 
// ── Subir archivo ─────────────────────────────────────────────────────────────
 
export async function uploadCertificadoFile(
  uid: string,
  certId: string,
  file: File,
  onProgress?: (pct: number) => void
): Promise<{ url: string; fileType: "image" | "pdf" }> {
  const isImage = file.type.startsWith("image/");
  const isPDF   = file.type === "application/pdf";
 
  if (!isImage && !isPDF)
    throw new Error("Solo se permiten imágenes (JPG, PNG, WebP) o archivos PDF.");
  if (file.size > 10 * 1024 * 1024)
    throw new Error("El archivo no puede superar 10 MB.");
 
  const ext      = isImage ? "img" : "pdf";
  const path     = `certificados/${uid}/${certId}.${ext}`;
  const storageRef = ref(storage, path);
  const task     = uploadBytesResumable(storageRef, file, { contentType: file.type });
 
  return new Promise((resolve, reject) => {
    task.on(
      "state_changed",
      (snap) => onProgress?.(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
      (err) => reject(new Error(err.message)),
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        resolve({ url, fileType: isImage ? "image" : "pdf" });
      }
    );
  });
}
 
// ── Helper: formato de fecha ──────────────────────────────────────────────────
 
export function formatFecha(fecha: string): string {
  if (!fecha) return "";
  const [year, month] = fecha.split("-");
  const meses = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  return `${meses[parseInt(month) - 1]} ${year}`;
}