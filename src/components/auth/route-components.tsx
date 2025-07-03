"use client"

import { Navigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";

export const ProtectedRoute = ({ Component }: { Component: () => JSX.Element }) => {
    const { user } = useUser();

    return !user ? <Navigate to='/login' /> : <Component />;
};