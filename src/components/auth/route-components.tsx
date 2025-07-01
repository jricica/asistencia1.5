"use client"

import { Navigate } from "react-router-dom";
import { fine } from "@/lib/fine";

export const ProtectedRoute = ({
  Component,
  allowedRoles,
}: {
  Component: () => JSX.Element;
  allowedRoles?: string[];
}) => {
  const {
    data: session,
    isPending,
    error,
  } = fine.auth.useSession();

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error || !session?.user) {
    return <Navigate to="/login" replace />;
  }

  // Si hay roles definidos, verificar que el usuario tenga acceso
  if (
    allowedRoles &&
    (!("role" in session.user) ||
      !allowedRoles.includes((session.user as any).role))
  ) {
    return <Navigate to="/dashboard" replace />;
    }   
  return <Component />;
};
export const AdminRoute = ({ Component }: { Component: () => JSX.Element }) => {
  return (
    <ProtectedRoute
      Component={Component}
      allowedRoles={["admin"]}
    />
  );
};
export const TeacherRoute = ({ Component }: { Component: () => JSX.Element }) => {
  return (
    <ProtectedRoute
      Component={Component}
      allowedRoles={["teacher"]}
    />
  );
};
export const StudentRoute = ({ Component }: { Component: () => JSX.Element }) => {
  return (
    <ProtectedRoute
      Component={Component}
      allowedRoles={["student"]}
    />
  );
};
export const UserRoute = ({ Component }: { Component: () => JSX.Element }) => {
  return (
    <ProtectedRoute
      Component={Component}
      allowedRoles={["admin", "teacher", "student"]}
    />
  );
};