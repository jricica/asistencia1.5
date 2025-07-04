"use client"

import { Navigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";

interface ProtectedProps {
  Component: () => JSX.Element;
  roles?: string[];
}

export const ProtectedRoute = ({ Component, roles }: ProtectedProps) => {
  const { user } = useUser();

  if (!user) return <Navigate to='/login' />;
  if (roles && !roles.includes(user.role)) {
    // Redirect to dashboard for unauthorized roles
    return <Navigate to='/dashboard' replace />;
  }
  return <Component />;
};