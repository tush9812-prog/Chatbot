import { useCallback, useState } from "react";
import "./App.css";
import Background from "./assets/background.png";
import { ChatHistory } from "./components/chatHistory/ChatHistory.tsx";
import Footer from "./components/Footer/Footer.tsx";
import { Chat } from "./components/chat/Chat.tsx";
import type { CustomMessage } from "./types/types.ts";
import { DefaultChat } from "./components/defaultChat/DefaultChat.tsx";
import { Outlet } from "react-router-dom";
import { ChatAppProvider } from "./chat/ChatAppContext.tsx";
function App() {
  const [loader, setLoader] = useState(true);
  const [conversations, setConversations] = useState<
    Record<string, CustomMessage[]>
  >({});
  return (
    <ChatAppProvider value={{ conversations, setConversations }}>
      <div className="app">
        {/* <img src={Background} className="img-background" /> */}
        <div className="app-body">
          <div className="sidebar">
            <ChatHistory
              loader={loader}
              setLoader={setLoader}
              conversations={conversations}
              setConversations={setConversations}
            />
          </div>

          <div className="app-text">
            <div className="chats">
              <Outlet context={{ conversations, setConversations }} />
            </div>
            <div className="footers">
              <Footer loader={loader} setLoader={setLoader} />
            </div>
          </div>
        </div>
      </div>
    </ChatAppProvider>
  );
}

export default App;
