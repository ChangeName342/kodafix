import {
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import {
  doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc,
  collection, serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../firebase/config";
import type { UserRole } from "../hooks/useAuth";
 
// ── Dominio permitido ─────────────────────────────────────────────────────────
 
const ALLOWED_DOMAIN = "kodafix.cl";
 
// ── Validaciones ──────────────────────────────────────────────────────────────
 
export function validateEmail(email: string): string {
  if (!email) return "El correo es requerido.";
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) return "El formato del correo no es válido.";
  if (!email.endsWith(`@${ALLOWED_DOMAIN}`))
    return `Solo se permiten correos @${ALLOWED_DOMAIN}.`;
  return "";
}
 
export function validatePassword(password: string): string {
  if (!password) return "La contraseña es requerida.";
  if (password.length < 8) return "Debe tener al menos 8 caracteres.";
  if (!/[A-Z]/.test(password)) return "Debe incluir al menos una letra mayúscula.";
  if (!/[0-9]/.test(password)) return "Debe incluir al menos un número.";
  if (!/[^A-Za-z0-9]/.test(password)) return "Debe incluir al menos un carácter especial.";
  return "";
}
 
export function validateDisplayName(name: string): string {
  if (!name.trim()) return "El nombre es requerido.";
  if (name.trim().length < 3) return "El nombre debe tener al menos 3 caracteres.";
  return "";
}
 
// ── Login ─────────────────────────────────────────────────────────────────────
 
export async function loginUser(email: string, password: string) {
  const emailErr = validateEmail(email);
  if (emailErr) throw new Error(emailErr);
 
  const cred = await signInWithEmailAndPassword(auth, email, password);
 
  const snap = await getDoc(doc(db, "users", cred.user.uid));
  if (!snap.exists()) {
    await signOut(auth);
    throw new Error("Usuario no autorizado para acceder al panel.");
  }
 
  return cred.user;
}
 
// ── Logout ────────────────────────────────────────────────────────────────────
 
export async function logoutUser() {
  await signOut(auth);
}
 
// ── Reset de contraseña ───────────────────────────────────────────────────────
 
export async function sendResetEmail(email: string) {
  const emailErr = validateEmail(email);
  if (emailErr) throw new Error(emailErr);
 
  await sendPasswordResetEmail(auth, email, {
    url: `${window.location.origin}/login`,
  });
}
 
// ── Cambiar contraseña ────────────────────────────────────────────────────────
 
export async function changePassword(currentPassword: string, newPassword: string) {
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error("No hay sesión activa.");
 
  const passErr = validatePassword(newPassword);
  if (passErr) throw new Error(passErr);
  if (newPassword === currentPassword)
    throw new Error("La nueva contraseña debe ser diferente a la actual.");
 
  const cred = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, cred);
  await updatePassword(user, newPassword);
}
 
// ── Tipo UserData ─────────────────────────────────────────────────────────────
 
export type UserData = {
  uid:                string;
  email:              string;
  displayName:        string;
  role:               UserRole;
  createdAt:          Date | null;
  mustChangePassword?: boolean;
};
 
// ── Listar usuarios ───────────────────────────────────────────────────────────
 
export async function listUsers(): Promise<UserData[]> {
  const snap = await getDocs(collection(db, "users"));
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      uid:                d.id,
      email:              data.email        ?? "",
      displayName:        data.displayName  ?? "",
      role:               data.role         ?? "admin",
      createdAt:          data.createdAt?.toDate?.() ?? null,
      mustChangePassword: data.mustChangePassword ?? false,
    };
  });
}
 
// ── Crear usuario ─────────────────────────────────────────────────────────────
// Guarda las credenciales del fundador, crea el nuevo usuario,
// y vuelve a autenticar al fundador automáticamente.
 
export async function createAdminUser(
  email:       string,
  displayName: string,
  role:        UserRole,
  founderPassword: string        // ← necesitamos la contraseña del fundador
): Promise<void> {
  const emailErr = validateEmail(email);
  if (emailErr) throw new Error(emailErr);
 
  const nameErr = validateDisplayName(displayName);
  if (nameErr) throw new Error(nameErr);
 
  const currentUser = auth.currentUser;
  if (!currentUser?.email) throw new Error("No hay sesión activa.");
 
  const founderEmail = currentUser.email;
  const tempPassword = generateTempPassword();
 
  // 1. Crea el nuevo usuario en Firebase Auth
  const cred = await createUserWithEmailAndPassword(auth, email, tempPassword);
  await updateProfile(cred.user, { displayName });
 
  // 2. Guarda en Firestore
  await setDoc(doc(db, "users", cred.user.uid), {
    uid:                cred.user.uid,
    email,
    displayName,
    role,
    createdAt:          serverTimestamp(),
    mustChangePassword: true,
  });
 
  // 3. Envía correo de reset para que establezca su contraseña
  await sendPasswordResetEmail(auth, email, {
    url: `${window.location.origin}/login`,
  });
 
  // 4. Cierra la sesión del usuario recién creado
  await signOut(auth);
 
  // 5. Vuelve a autenticar al fundador automáticamente
  await signInWithEmailAndPassword(auth, founderEmail, founderPassword);
}
 
// ── Editar usuario ────────────────────────────────────────────────────────────
 
export async function updateUser(
  uid:  string,
  data: { displayName?: string; role?: UserRole }
): Promise<void> {
  if (data.displayName !== undefined) {
    const nameErr = validateDisplayName(data.displayName);
    if (nameErr) throw new Error(nameErr);
  }
 
  await updateDoc(doc(db, "users", uid), {
    ...(data.displayName !== undefined && { displayName: data.displayName }),
    ...(data.role        !== undefined && { role:        data.role        }),
  });
}
 
// ── Eliminar usuario ──────────────────────────────────────────────────────────
 
export async function deleteUserFromFirestore(uid: string): Promise<void> {
  const currentUser = auth.currentUser;
  if (currentUser?.uid === uid)
    throw new Error("No puedes eliminar tu propia cuenta.");
  await deleteDoc(doc(db, "users", uid));
}
 
// ── Helper ────────────────────────────────────────────────────────────────────
 
function generateTempPassword(): string {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$";
  let pwd = "";
  for (let i = 0; i < 16; i++) pwd += chars[Math.floor(Math.random() * chars.length)];
  return pwd;
}