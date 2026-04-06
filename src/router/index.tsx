import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider, useAuthContext } from "../context/AuthContext";
import { ThemeProvider } from "../context/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";
import App         from "../App";
import Login       from "../pages/Login";
import Dashboard   from "../pages/Dashboard";
import Contact     from "../pages/Contact";
import PlanDetalle from "../pages/PlanDetalle";
import Equipo      from "../pages/Equipo";
import Contratar      from "../pages/Contratar";
import PagoResultado  from "../pages/PagoResultado";
import Terminos       from "../pages/Terminos";

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Hay un anchor → espera a que el DOM esté listo y hace scroll al elemento
      const id = hash.replace("#", "");
      const tryScroll = (attempts = 0) => {
        const el = document.getElementById(id);
        if (el) {
          // Pequeño delay para que React termine de pintar la página
          setTimeout(() => {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 80);
        } else if (attempts < 10) {
          // El elemento aún no existe, reintenta
          setTimeout(() => tryScroll(attempts + 1), 100);
        }
      };
      tryScroll();
    } else {
      // Sin hash → siempre va al top
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [pathname, hash]);

  return null;
}

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

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthContext();
  if (loading) return null;
  return user ? <Navigate to="/dashboard" replace /> : <>{children}</>;
}

function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <ThemeToggle />
      <Routes>
        <Route path="/"               element={<App />} />
        <Route path="/contacto"       element={<Contact />} />
        <Route path="/equipo"         element={<Equipo />} />
        <Route path="/planes/:planId"    element={<PlanDetalle />} />
        <Route path="/contratar/:planId" element={<Contratar />} />
        <Route path="/pago/resultado"    element={<PagoResultado />} />
        <Route path="/terminos"          element={<Terminos />} />
        <Route path="/login" element={
          <PublicRoute><Login /></PublicRoute>
        } />
        <Route path="/dashboard" element={
          <PrivateRoute><Dashboard /></PrivateRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function Router() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}