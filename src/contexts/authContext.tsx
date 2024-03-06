"use client";

import React, { createContext, useContext, useState } from "react";

const SessionContext = createContext<SessionContextType>(null);

type SessionContextType = {
  isConnected: boolean;
  setIsConnected: React.Dispatch<React.SetStateAction<boolean>>;
} | null;

export default function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isConnected, setIsConnected] = useState(false);

  const contextValue: SessionContextType = {
    isConnected,
    setIsConnected,
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
