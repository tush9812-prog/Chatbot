import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import "./Footer.css";
import { SearchIcon } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useNavigate, useParams } from "react-router-dom";
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
  let { chatId } = useParams();
  const { setConversations } = useChatApp();
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    const id = chatId ?? crypto.randomUUID();

    const userMessage: CustomMessage = {
      id: crypto.randomUUID(),
      role: "User",
      prompt: value,
      requestId: crypto.randomUUID(),
      response: undefined,
      timestamp: Date.now(),
    };
    console.log("userMessage", userMessage);
    setConversations((prev) => {
      const current = prev[id] ?? [];
      return { ...prev, [id]: [...current, userMessage] };
    });
    if (!chatId) {
      navigate(`/c/${id}`);
    }
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
