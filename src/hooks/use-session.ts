import { useState, useEffect } from "react";
import { fine } from "@/lib/fine";

export function useSession() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    setSession(fine.auth.getSessionSync?.() || null);
  }, []);

  return { session };
}
