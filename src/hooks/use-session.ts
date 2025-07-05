// ⚠️ Archivo migrado a JS. No usar este `.ts`.
import { useUser } from "@/context/UserContext";

export function useSession() {
  const { user } = useUser();
  return { session: user ? { user } : null };
}
