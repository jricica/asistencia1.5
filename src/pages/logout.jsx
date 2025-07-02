

import { useEffect } from "react";
import { Navigate } from "react-router-dom";

export default function Logout() {
  useEffect(() => {
    localStorage.removeItem("user"); // Elimina la sesión
  }, []);

  return <Navigate to="/login" replace />;
}
