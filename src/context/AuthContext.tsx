import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import type { AuthUser } from "../hooks/useAuth";

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  isFounder: boolean;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isFounder: false,
  isAdmin: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isFounder: user?.role === "founder",
      isAdmin:   user?.role === "admin" || user?.role === "founder",
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}