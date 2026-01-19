import type { CustomMessage } from "@/types/types";
import "./DefaultChat.css";

export const DefaultChat = ({ messages, setMessages }) => {
  const click = ({ action }) => {
    const requestId: string = crypto.randomUUID();
    const userMessage: CustomMessage = {
      id: crypto.randomUUID(),
      role: "User",
      prompt: `${action}`,
      requestId: requestId,
      response: undefined,
      timestamp: Date.now(),
    };
    setMessages((prevMessages: CustomMessage[]) => [
      ...prevMessages,
      userMessage,
    ]);
  };

  return (
    <div className="text-center text-gray-400 py-8 default-chat">
      <button
        className="button default-weather"
        onClick={() => click({ action: "Weather" })}
      >
        {/* <img
                src={WeatherButton}
                style={{ width: "28px", height: "28px", objectFit: "contain" }}
              /> */}
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
