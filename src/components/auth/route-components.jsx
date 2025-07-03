import { Navigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";

export const ProtectedRoute = ({ Component }) => {
    const { user } = useUser();

    if (!user) return <Navigate to='/login' />;

    return <Component />;
};