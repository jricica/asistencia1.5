"use client"

import { Navigate } from "react-router-dom";
import { fine } from "@/lib/fine";

export const ProtectedRoute = ({ Component }: { Component: () => JSX.Element }) => {
    const {
        data: session,
        isPending,
        error,
    } = fine.auth.useSession()

    if (isPending) {
        return (
            <div className="flex h-screen items-center justify-center">
                Loading...
            </div>
        );
    }

    if (error) {
        console.error("Session error:", error)
        return <Navigate to='/login' />
    }

    return session?.user ? <Component /> : <Navigate to='/login' />;
};