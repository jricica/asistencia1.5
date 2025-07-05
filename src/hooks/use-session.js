import { useUser } from "@/context/UserContext";
export function useSession() {
    const { user } = useUser();
    return { session: user ? { user } : null };
}
