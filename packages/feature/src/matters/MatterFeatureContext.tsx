import { createContext, useContext } from "react";
import type { ChatMessage } from "@mah/api/src/clients/chat.api";

export interface MatterPaths {
  index: () => string;
  detail: (params: { matterId: string }) => string;
  document: (params: { matterId: string; documentId: string }) => string;
}

export interface MatterFeatureContextValue {
  paths: MatterPaths;
  chatPathResolver?: (chatId: string) => string;
  MessageComponent?: React.ComponentType<{ message: ChatMessage }>;
}

const MatterFeatureContext = createContext<MatterFeatureContextValue | null>(
  null,
);

export function MatterFeatureProvider({
  value,
  children,
}: {
  value: MatterFeatureContextValue;
  children: React.ReactNode;
}) {
  return (
    <MatterFeatureContext.Provider value={value}>
      {children}
    </MatterFeatureContext.Provider>
  );
}

export function useMatterFeature(): MatterFeatureContextValue {
  const context = useContext(MatterFeatureContext);
  if (!context) {
    throw new Error(
      "useMatterFeature must be used within a MatterFeatureProvider",
    );
  }
  return context;
}
