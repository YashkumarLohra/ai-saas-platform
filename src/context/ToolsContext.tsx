"use client";

import { createContext, useContext, ReactNode } from "react";
import { Recommendation } from "@/types/index";

interface ToolsContextType {
  tools: Recommendation[];
}

const ToolsContext = createContext<ToolsContextType | undefined>(undefined);

export function ToolsProvider({ 
  children, 
  initialTools 
}: { 
  children: ReactNode; 
  initialTools: Recommendation[];
}) {
  return (
    <ToolsContext.Provider value={{ tools: initialTools }}>
      {children}
    </ToolsContext.Provider>
  );
}

export function useTools() {
  const context = useContext(ToolsContext);
  if (context === undefined) {
    throw new Error("useTools must be used within a ToolsProvider");
  }
  return context;
}
