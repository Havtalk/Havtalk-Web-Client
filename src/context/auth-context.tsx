"use client";
import React, { createContext, useState, useContext, useEffect } from "react";

type AuthContextType = {
  sessionExpired: boolean;
  triggerSessionExpired: () => void;
  resetSessionExpired: () => void;
};


const AuthContext = createContext<AuthContextType>({
  sessionExpired: false,
  triggerSessionExpired: () => {},
  resetSessionExpired: () => {},
});

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    const handler = () => setSessionExpired(true);
    window.addEventListener("authExpired", handler);
    return () => window.removeEventListener("authExpired", handler);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        sessionExpired,
        triggerSessionExpired: () => setSessionExpired(true),
        resetSessionExpired: () => setSessionExpired(false),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


