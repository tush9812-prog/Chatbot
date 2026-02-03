// ChatHistory.tsx
import "./ChatHistory.css";
import {
  Sidebar,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
} from "flowbite-react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { useNavigate, useParams } from "react-router-dom";
import type { CustomMessage } from "../../types/types";

export const ChatHistory = ({
  loader,
  setLoader,
  conversations,
  setConversations,
}) => {
  const navigate = useNavigate();
  const { chatId } = useParams();

  const chatIds = Object.keys(conversations);

  const onNewPage = () => {
    const id = crypto.randomUUID();
    setConversations((prev) => ({ ...prev, [id]: [] }));
    navigate(`/c/${id}`); // programmatic navigation from button click [web:22]
  };

  return (
    <div className="chat-history">
      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          className="new-page-button"
          onClick={onNewPage}
        >
          New Page
        </Button>
      </Stack>

      <Sidebar aria-label="Chats" className="w-28 sidebar-component">
        <SidebarItems className="m-2">
          <SidebarItemGroup className="m-2">
            {chatIds.map((id) => {
              const firstUserPrompt =
                (conversations[id] ?? []).find(
                  (m: CustomMessage) => m.role === "User",
                )?.prompt ?? "New chat";

              return (
                <SidebarItem
                  key={id}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/c/${id}`);
                  }}
                  className={`m-2 ${chatId === id ? "active-chat" : ""}`}
                >
                  <div className="prompt">{firstUserPrompt}</div>
                </SidebarItem>
              );
            })}
          </SidebarItemGroup>
        </SidebarItems>
      </Sidebar>
    </div>
  );
};
