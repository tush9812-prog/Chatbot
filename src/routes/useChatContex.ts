import { useOutletContext } from "react-router-dom";
import type { CustomMessage } from "../types/types";

export type ChatCtx = {
  conversations: Record<string, CustomMessage[]>;
  setConversations: React.Dispatch<
    React.SetStateAction<Record<string, CustomMessage[]>>
  >;
};
export function useChatContext() {
  return useOutletContext<ChatCtx>();
}
