"use client";

import React, { createContext, useContext, useState } from "react";

const SessionContext = createContext<SessionContextType>(null);

export type User = {
  login: string;
  role: string;
} | null;

type SessionContextType = {
  userConnected: User;
  setUserConnected: React.Dispatch<React.SetStateAction<User>>;
} | null;

export default function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userConnected, setUserConnected] = useState<User>(null);

  const contextValue: SessionContextType = {
    userConnected,
    setUserConnected,
  };

  return (
    <SessionContext.Provider value={contextValue}>
      {children}
    </SessionContext.Provider>
  );
}

export const useSession = () => {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }

  return context;
};
