import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import "./Footer.css";
import { SearchIcon } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useParams } from "react-router-dom";
import { useChatApp } from "../../chat/ChatAppContext";
import type { CustomMessage } from "../../types/types";

export function InputGroupIcon({ value, onChange }) {
  return (
    <div className={`w-full max-w-sm gap-6 text-white input`}>
      <InputGroup>
        <InputGroupInput
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search..."
        />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}

function Footer({ loader, setLoader }) {
  const [value, setValue] = useState("");
  const { chatId } = useParams();
  const { setConversations } = useChatApp();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim() || !chatId) return;

    const userMessage: CustomMessage = {
      id: crypto.randomUUID(),
      role: "User",
      prompt: value,
      requestId: crypto.randomUUID(),
      response: undefined,
      timestamp: Date.now(),
    };

    setConversations((prev) => {
      const current = prev[chatId] ?? [];
      return { ...prev, [chatId]: [...current, userMessage] };
    });

    setValue("");
  };
  return (
    <form className="footer flex items-center gap-2" onSubmit={handleSubmit}>
      <InputGroupIcon value={value} onChange={setValue} />
      <Button variant="outline" type="submit">
        Click me
      </Button>
    </form>
  );
  // render ...
}
export default Footer;
