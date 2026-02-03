import type { CustomMessage } from "@/types/types";
import "./DefaultChat.css";
import { useNavigate, useParams } from "react-router-dom";
import { useChatContext } from "../../routes/useChatContex.ts";
import { useChatApp } from "@/chat/ChatAppContext.tsx";

export const DefaultChat = () => {
  const navigate = useNavigate(); // programmatic navigation [web:28]
  const { chatId } = useParams(); // may be undefined on "/" [web:28]
  const { setConversations } = useChatApp();

  const click = ({ action }) => {
    const id = chatId ?? crypto.randomUUID();

    const userMessage: CustomMessage = {
      id: crypto.randomUUID(),
      role: "User",
      prompt: `${action}`,
      requestId: crypto.randomUUID(),
      response: undefined,
      timestamp: Date.now(),
    };

    setConversations((prev) => {
      const current = prev[id] ?? [];
      return { ...prev, [id]: [...current, userMessage] };
    });
    if (!chatId) navigate(`/c/${id}`);
  };

  return (
    <div className="text-center text-gray-400 default-chat">
      <button
        className="button default-weather"
        onClick={() => click({ action: "Weather" })}
      >
        Weather
      </button>
      <button
        className="button default-finance"
        onClick={() => click({ action: "Finance" })}
      >
        Finance
      </button>
      <button
        className="button default-news"
        onClick={() => click({ action: "News" })}
      >
        News
      </button>
      <button
        className="button default-Sports"
        onClick={() => click({ action: "Sports" })}
      >
        Sports
      </button>
    </div>
  );
};
