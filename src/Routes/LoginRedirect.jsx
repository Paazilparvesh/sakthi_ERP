import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

const LoginRedirect = ({ children }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  // Wait until auth is restored from localStorage
  if (isLoading) return null;

  // If logged in → redirect to correct dashboard
  if (isAuthenticated && user) {
    if (user.isAdmin) return <Navigate to="/admin_dashboard" replace />;
    if (user.roles.includes("inward")) return <Navigate to="/inward" replace />;
    if (user.roles.includes("qa")) return <Navigate to="/qa_dashboard" replace />;
    if (user.roles.includes("accountent")) return <Navigate to="/accounts_dashboard" replace />;
    if (user.roles.includes("programer")) return <Navigate to="/programer" replace />;

    return <Navigate to="/dashboard" replace />;
  }

  // If not logged in → show login page
  return children;
};

export default LoginRedirect;
