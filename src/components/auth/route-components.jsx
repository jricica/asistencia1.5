import { Navigate } from "react-router-dom";
import { fine } from "@/lib/fine";

export const ProtectedRoute = ({ Component }) => {
    const { 
        data: session, 
        isPending, //loading state
        error, //error object
    } = fine.auth.useSession();

    if (isPending) return <div className="flex h-screen items-center justify-center">Loading...</div>;
    
    return !session?.user ? <Navigate to='/login' /> : <Component />;
};