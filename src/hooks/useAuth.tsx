import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";

export type UserRole = "founder" | "admin";

export type AuthUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: UserRole;
};

export function useAuth() {
  const [user, setUser]       = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      console.log("onAuthStateChanged fired:", firebaseUser?.email); // debug temporal
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      const snap = await getDoc(doc(db, "users", firebaseUser.uid));
      const data = snap.data();
      console.log("snap exists:", snap.exists(), "data:", data); // debug temporal

      setUser({
        uid:         firebaseUser.uid,
        email:       firebaseUser.email,
        displayName: firebaseUser.displayName,
        role:        (data?.role as UserRole) ?? "admin",
      });
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return { user, loading };
}