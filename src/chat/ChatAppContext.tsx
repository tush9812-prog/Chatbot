import { createContext, useContext } from "react";
import type { CustomMessage } from "../types/types";

type ChatAppCtx = {
  conversations: Record<string, CustomMessage[]>;
  setConversations: React.Dispatch<
    React.SetStateAction<Record<string, CustomMessage[]>>
  >;
};

const ChatAppContext = createContext<ChatAppCtx | null>(null);

export function ChatAppProvider({
  value,
  children,
}: {
  value: ChatAppCtx;
  children: React.ReactNode;
}) {
  return (
    <ChatAppContext.Provider value={value}>{children}</ChatAppContext.Provider>
  );
}

export function useChatApp() {
  const ctx = useContext(ChatAppContext);
  if (!ctx) throw new Error("useChatApp must be used inside ChatAppProvider");
  return ctx;
}
