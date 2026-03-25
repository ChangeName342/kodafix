import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuthContext } from "../context/AuthContext";
import App       from "../App";
import Login     from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Contact from "../pages/Contact";

// Protege rutas autenticadas
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthContext();

  if (loading) return (
    <div style={{ background: "#070710", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 32, height: 32, border: "2px solid rgba(168,85,247,0.2)", borderTop: "2px solid #a855f7", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );

  return user ? <>{children}</> : <Navigate to="/login" replace />;
}

// Redirige si ya está logueado
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthContext();
  if (loading) return null;
  return user ? <Navigate to="/dashboard" replace /> : <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      <Route path="/dashboard" element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route path="/contacto" element={<Contact />} />
    </Routes>
  );
}

export default function Router() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}