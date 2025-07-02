import { useState, useEffect } from "react";

export function useSession() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("session");
    if (stored) {
      try {
        setSession(JSON.parse(stored));
      } catch (error) {
        console.error("Failed to parse session:", error);
        setSession(null);
      }
    }
  }, []);

  return { session };
}
