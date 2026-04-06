import {
  collection, doc, addDoc, updateDoc, deleteDoc,
  getDocs, query, where, serverTimestamp, orderBy,
} from "firebase/firestore";
import { db } from "../firebase/config";
 
// ── Categorías y niveles ──────────────────────────────────────────────────────
 
export const CATEGORIAS = [
  "Frontend",
  "Backend",
  "Mobile",
  "Base de datos",
  "Cloud & DevOps",
  "Inteligencia Artificial",
  "Diseño",
  "Herramientas",
  "Otro",
] as const;
 
export const NIVELES = [
  { value: "basico",        label: "Básico",        color: "#06b6d4", pct: 25 },
  { value: "intermedio",    label: "Intermedio",    color: "#a855f7", pct: 50 },
  { value: "avanzado",      label: "Avanzado",      color: "#10b981", pct: 75 },
  { value: "experto",       label: "Experto",       color: "#f97316", pct: 100 },
] as const;
 
export type Categoria = typeof CATEGORIAS[number];
export type Nivel     = typeof NIVELES[number]["value"];
 
export type Habilidad = {
  id:        string;
  uid:       string;
  nombre:    string;
  categoria: Categoria;
  nivel:     Nivel;
  createdAt: Date | null;
};
 
export type HabilidadForm = Omit<Habilidad, "id" | "uid" | "createdAt">;
 
export const EMPTY_FORM: HabilidadForm = {
  nombre: "", categoria: "Frontend", nivel: "intermedio",
};
 
// Sugerencias de tecnologías populares por categoría
export const SUGERENCIAS: Record<Categoria, string[]> = {
  "Frontend":               ["React", "Vue", "Angular", "Next.js", "TypeScript", "JavaScript", "HTML", "CSS", "Tailwind CSS", "Svelte"],
  "Backend":                ["Node.js", "Express", "Python", "Django", "FastAPI", "Java", "Spring Boot", "PHP", "Laravel", "Ruby on Rails", "Go", "Rust", "C#", ".NET"],
  "Mobile":                 ["React Native", "Flutter", "Swift", "Kotlin", "Ionic", "Expo"],
  "Base de datos":          ["PostgreSQL", "MySQL", "MongoDB", "Firebase", "Redis", "SQLite", "Supabase", "DynamoDB"],
  "Cloud & DevOps":         ["AWS", "GCP", "Azure", "Docker", "Kubernetes", "CI/CD", "Terraform", "Linux", "Nginx"],
  "Inteligencia Artificial":["Python", "TensorFlow", "PyTorch", "scikit-learn", "OpenAI API", "LangChain", "Pandas", "NumPy"],
  "Diseño":                 ["Figma", "Adobe XD", "Photoshop", "Illustrator", "Framer"],
  "Herramientas":           ["Git", "GitHub", "Jira", "Notion", "VS Code", "Postman", "Webpack", "Vite"],
  "Otro":                   [],
};
 
// ── Validación ────────────────────────────────────────────────────────────────
 
export function validateHabilidad(data: HabilidadForm): Partial<Record<keyof HabilidadForm, string>> {
  const errors: Partial<Record<keyof HabilidadForm, string>> = {};
  if (!data.nombre.trim()) errors.nombre = "El nombre es requerido.";
  if (data.nombre.length > 50) errors.nombre = "Máximo 50 caracteres.";
  return errors;
}
 
// ── CRUD ──────────────────────────────────────────────────────────────────────
 
export async function getHabilidades(uid: string): Promise<Habilidad[]> {
  const q = query(
    collection(db, "habilidades"),
    where("uid", "==", uid),
    orderBy("categoria"),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id:        d.id,
      uid:       data.uid        ?? "",
      nombre:    data.nombre     ?? "",
      categoria: data.categoria  ?? "Otro",
      nivel:     data.nivel      ?? "intermedio",
      createdAt: data.createdAt?.toDate?.() ?? null,
    };
  });
}
 
export async function createHabilidad(uid: string, data: HabilidadForm): Promise<void> {
  await addDoc(collection(db, "habilidades"), {
    ...data,
    uid,
    createdAt: serverTimestamp(),
  });
}
 
export async function updateHabilidad(id: string, data: Partial<HabilidadForm>): Promise<void> {
  await updateDoc(doc(db, "habilidades", id), data);
}
 
export async function deleteHabilidad(id: string): Promise<void> {
  await deleteDoc(doc(db, "habilidades", id));
}