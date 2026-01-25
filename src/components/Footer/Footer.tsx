import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import "./Footer.css";
import { SearchIcon } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import type { CustomMessage } from "../../types/types";
export function InputGroupIcon({ value, onChange }) {
  return (
    // <div className={`grid max-w-sm gap-6 ${className}`} ref={ref}>
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
export function ButtonOutline() {
  return <Button variant="outline">Outline</Button>;
}
function Footer({ loader, setLoader, messages, setMessages }) {
  const [value, setValue] = useState("");

  const handleSubmit = async (e) => {
    // Prevent the page from refreshing on submit
    if (e) e.preventDefault();

    if (!value.trim()) {
      console.error("Input is empty.");
      return;
    }

    const requestId = crypto.randomUUID();
    const userMessage = {
      id: crypto.randomUUID(),
      role: "User",
      prompt: value,
      requestId: requestId,
      response: undefined,
      timestamp: Date.now(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setValue("");
  };

  return (
    /* Wrap in a form to catch the Enter key automatically */
    <form className="footer flex items-center gap-2" onSubmit={handleSubmit}>
      <InputGroupIcon value={value} onChange={setValue} />

      {/* Ensure type="submit" so it triggers the form onSubmit */}
      <Button variant="outline" type="submit">
        Click me
      </Button>
    </form>
  );
}

export default Footer;
