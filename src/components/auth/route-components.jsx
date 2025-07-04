import { Navigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";

export const ProtectedRoute = ({ Component, roles }) => {
    const { user } = useUser();

    if (!user) return <Navigate to='/login' />;
    if (roles && !roles.includes(user.role)) {
        return <Navigate to='/dashboard' replace />;
    }

    return <Component />;
};