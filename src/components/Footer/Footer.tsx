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
    <div className={` w-[420px] max-w-sm gap-6 text-white`}>
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

  const onClick = async () => {
    const requestId: string = crypto.randomUUID();

    if (!value) {
      console.error("Input ref is not attached to the DOM element.");
      return;
    }
    const userMessage: CustomMessage = {
      id: crypto.randomUUID(),
      role: "User",
      prompt: value,
      requestId: requestId,
      response: undefined,
      timestamp: Date.now(),
    };
    // setMessages((prevMessages: CustomMessage[]) => [
    //   ...prevMessages,
    //   userMessage,
    // ]);
    setMessages((prevMessages: CustomMessage[]) => [
      ...prevMessages,
      userMessage,
    ]);
    setValue("");
  };

  return (
    <div className="footer flex items-center gap-2">
      <InputGroupIcon value={value} onChange={setValue} />
      <Button variant="outline" onClick={onClick}>
        Click me
      </Button>
    </div>
  );
}
export default Footer;
