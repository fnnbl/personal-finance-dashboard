import { useAuth } from "./AuthContext";
import { Navigate } from "react-router-dom";

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null; // oder ein Loader
  return user ? children : <Navigate to="/login" />;
}