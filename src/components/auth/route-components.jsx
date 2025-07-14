import { Navigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";

export const ProtectedRoute = ({ Component, roles = [] }) => {
  const { user, isLoading } = useUser();

  if (isLoading) return null; // o un spinner

  if (!user) return <Navigate to="/login" />;
  if (roles.length && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;

  return <Component />;
};
