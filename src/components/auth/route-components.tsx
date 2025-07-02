import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({
  Component,
  allowedRoles,
}: {
  Component: () => JSX.Element;
  allowedRoles?: string[];
}) => {
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, []);

  if (user === null) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Component />;
};
