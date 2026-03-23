import {
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase/config";
import type { UserRole } from "../hooks/useAuth";

// ── Validaciones ──────────────────────────────────────────────────────────────

export function validateEmail(email: string): string {
  if (!email) return "El correo es requerido.";
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) return "El formato del correo no es válido.";
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

// ── Login ─────────────────────────────────────────────────────────────────────

export async function loginUser(email: string, password: string) {
  const emailErr = validateEmail(email);
  if (emailErr) throw new Error(emailErr);

  const cred = await signInWithEmailAndPassword(auth, email, password);

  // Verifica que el usuario exista en Firestore y tenga rol válido
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

// ── Reset de contraseña por correo ────────────────────────────────────────────

export async function sendResetEmail(email: string) {
  const emailErr = validateEmail(email);
  if (emailErr) throw new Error(emailErr);

  await sendPasswordResetEmail(auth, email, {
    url: `${window.location.origin}/login`,
  });
}

// ── Cambiar contraseña (requiere reautenticación) ─────────────────────────────

export async function changePassword(
  currentPassword: string,
  newPassword: string
) {
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error("No hay sesión activa.");

  const passErr = validatePassword(newPassword);
  if (passErr) throw new Error(passErr);

  if (newPassword === currentPassword)
    throw new Error("La nueva contraseña debe ser diferente a la actual.");

  // Reautentica antes de cambiar contraseña
  const cred = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, cred);
  await updatePassword(user, newPassword);
}

// ── Crear usuario (solo fundadores) ──────────────────────────────────────────

export async function createAdminUser(
  email: string,
  role: UserRole,
  displayName: string
) {
  const emailErr = validateEmail(email);
  if (emailErr) throw new Error(emailErr);

  // Crea el usuario en Firebase Auth con contraseña temporal
  // El usuario deberá cambiarla al entrar por primera vez
  const tempPassword = generateTempPassword();

  const { createUserWithEmailAndPassword, updateProfile } = await import("firebase/auth");
  const cred = await createUserWithEmailAndPassword(auth, email, tempPassword);

  await updateProfile(cred.user, { displayName });

  // Guarda perfil extendido en Firestore
  await setDoc(doc(db, "users", cred.user.uid), {
    uid:         cred.user.uid,
    email,
    displayName,
    role,
    createdAt:   serverTimestamp(),
    mustChangePassword: true,
  });

  // Envía correo para que el usuario establezca su contraseña real
  await sendPasswordResetEmail(auth, email, {
    url: `${window.location.origin}/login`,
  });

  // Cierra sesión del usuario recién creado para no desloguear al fundador
  await signOut(auth);

  return { email, tempPassword };
}

// ── Helper ────────────────────────────────────────────────────────────────────

function generateTempPassword(): string {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$";
  let pwd = "";
  for (let i = 0; i < 16; i++) {
    pwd += chars[Math.floor(Math.random() * chars.length)];
  }
  return pwd;
}