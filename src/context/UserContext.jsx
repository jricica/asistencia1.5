import React, { createContext, useContext, useState } from "react";
const UserContext = createContext(undefined);

export const UserProvider = ({ children }) => {
    const [user, setUserState] = useState(() => {
        try {
            const stored = localStorage.getItem('user');
            return stored ? JSON.parse(stored) : null;
        }
        catch {
            return null;
        }
    });
    const setUser = (u) => {
        setUserState(u);
        try {
            if (u) {
                localStorage.setItem('user', JSON.stringify(u));
            }
            else {
                localStorage.removeItem('user');
            }
        }
        catch {
            // ignore storage errors
        }
    };
    return (<UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>);
};
export const useUser = () => {
    const ctx = useContext(UserContext);
    if (!ctx)
        throw new Error("useUser must be used within a UserProvider");
    return ctx;
};
