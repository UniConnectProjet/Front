import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export default function PrivateRoute({ children, roles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  if (Array.isArray(roles) && roles.length > 0) {
    const hasRole = user?.roles?.some((r) => roles.includes(r));
    if (!hasRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
}
