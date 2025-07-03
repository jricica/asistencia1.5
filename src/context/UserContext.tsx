import React, { createContext, useContext, useState } from "react";

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
    try {
      const stored = localStorage.getItem('user');
      return stored ? (JSON.parse(stored) as User) : null;
    } catch {
      return null;
    }
  });

  const setUser = (u: User | null) => {
    setUserState(u);
    try {
      if (u) {
        localStorage.setItem('user', JSON.stringify(u));
      } else {
        localStorage.removeItem('user');
      }
    } catch {
      // ignore storage errors
    }
  };

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
