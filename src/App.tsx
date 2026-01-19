import { useCallback, useState } from "react";
import "./App.css";
import Background from "./assets/background.png";
import { ChatHistory } from "./components/chatHistory/ChatHistory.tsx";
import Footer from "./components/Footer/Footer.tsx";
import { Chat } from "./components/chat/Chat.tsx";
import type { CustomMessage } from "./types/types.ts";
import { DefaultChat } from "./components/defaultChat/DefaultChat.tsx";
function App() {
  const [loader, setLoader] = useState(true);
  const [messages, setMessages] = useState<CustomMessage[]>([]);
  const handleMessageUpdate = useCallback((id: string, response: string) => {
    setMessages((prev) => {
      const updated = prev.map((msg) =>
        msg.id === id ? { ...msg, response: response } : msg,
      );

      return updated;
    });
  }, []);
  return (
    <div className="app">
      {/* <img src={Background} className="img-background" /> */}
      <div className="app-body">
        <div className="sidebar">
          <ChatHistory
            loader={loader}
            setLoader={setLoader}
            messages={messages}
            setMessages={setMessages}
          />
        </div>

        <div className="app-text">
          <div className="chats">
            {" "}
            {messages.length === 0 ? (
              <DefaultChat />
            ) : (
              <Chat messages={messages} onMessageUpdate={handleMessageUpdate} />
            )}
          </div>
          <div className="footers">
            <Footer
              loader={loader}
              setLoader={setLoader}
              messages={messages}
              setMessages={setMessages}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
