import React, { createContext, useContext, useState, useEffect } from "react";

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface UserContextValue {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUserState] = useState<User | null>(() => {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const setUser = (u: User | null) => {
    setUserState(u);
    if (typeof window !== "undefined") {
      if (u) {
        localStorage.setItem("user", JSON.stringify(u));
      } else {
        localStorage.removeItem("user");
      }
    }
  };

  useEffect(() => {
    if (user === null && typeof window !== "undefined") {
      const stored = localStorage.getItem("user");
      if (stored) {
        try {
          setUserState(JSON.parse(stored));
        } catch {
          localStorage.removeItem("user");
        }
      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within a UserProvider");
  return ctx;
};
