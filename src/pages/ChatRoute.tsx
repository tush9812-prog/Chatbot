import { useParams, useOutletContext } from "react-router-dom";
import { Chat } from "../components/chat/Chat";
import { DefaultChat } from "../components/defaultChat/DefaultChat";
import type { CustomMessage } from "../types/types";
import { useChatApp } from "@/chat/ChatAppContext";

type Ctx = {
  conversations: Record<string, CustomMessage[]>;
  setConversations: React.Dispatch<
    React.SetStateAction<Record<string, CustomMessage[]>>
  >;
};

export function ChatRoute() {
  const { conversations, setConversations } = useChatApp();
  const { chatId } = useParams();
  const id = chatId!;

  const messages = conversations[id] ?? [];

  const setMessages = (updater: any) => {
    setConversations((prev) => {
      const current = prev[id] ?? [];
      const next = typeof updater === "function" ? updater(current) : updater;
      return { ...prev, [id]: next };
    });
  };

  const handleMessageUpdate = (msgId: string, response: string) => {
    setMessages((prev: CustomMessage[]) =>
      prev.map((m) => (m.id === msgId ? { ...m, response } : m)),
    );
  };

  return messages.length === 0 ? (
    <DefaultChat />
  ) : (
    <Chat messages={messages} onMessageUpdate={handleMessageUpdate} />
  );
}
