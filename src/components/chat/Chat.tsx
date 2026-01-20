import "./Chat.css";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { CustomMessage } from "../../types/types";
import { useCallback, useEffect, useRef, useMemo, useState } from "react";
interface ChatProps {
  messages: CustomMessage[];
  onMessageUpdate: (id: string, response: string) => void;
}

export const Chat = ({ messages, onMessageUpdate }: ChatProps) => {
  const API_URL = import.meta.env.VITE_SERVER_DOMAIN;
  // console.log("API_URL:", API_URL);
  // const API_URL = "http://localhost:8000";
  const getThreadId = () => {
    let threadId = localStorage.getItem("chat_thread_id");
    if (!threadId) {
      threadId = `user_${Date.now()}`;
      localStorage.setItem("chat_thread_id", threadId);
    }
    return threadId;
  };

  const threadIdRef = useRef(getThreadId());
  const processedIdsRef = useRef<Set<string>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(
    null,
  );
  const [renderTrigger, setRenderTrigger] = useState(0);
  const onMessageUpdateRef = useRef(onMessageUpdate);

  useEffect(() => {
    onMessageUpdateRef.current = onMessageUpdate;
  }, [onMessageUpdate]);

  const submitMessage = useCallback(
    async (content: string, id: string) => {
      if (processedIdsRef.current.has(id)) return;

      processedIdsRef.current.add(id);
      setStreamingMessageId(id);

      try {
        const response = await fetch(`${API_URL}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [{ role: "user", content }],
            thread_id: getThreadId(),
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let accumulatedResponse = "";

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split("\n");

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6).trim();
                // console.log("Received data:", data);
                if (data === "[DONE]") {
                  setStreamingMessageId(null);
                  break;
                }

                try {
                  const parsed = JSON.parse(data);
                  // console.log("Parsed:", parsed);
                  if (parsed.token) {
                    // console.log("Token:", parsed.token);
                    accumulatedResponse += parsed.token;
                    onMessageUpdateRef.current(id, accumulatedResponse);
                    setRenderTrigger((prev) => prev + 1);
                  }

                  if (parsed.error) {
                    onMessageUpdateRef.current(id, "Sorry, an error occurred.");
                    setStreamingMessageId(null);
                    break;
                  }
                } catch (e) {
                  console.warn("Failed to parse:", data, e);
                  // Skip invalid JSON lines
                  // console.warn("Failed to parse:", data);
                }
              }
            }
          }
        }
      } catch (error) {
        // console.error("Stream error:", error);
        onMessageUpdateRef.current(
          id,
          "Sorry, something went wrong. Please try again.",
        );
        setStreamingMessageId(null);
      }
    },
    [API_URL],
  );

  useEffect(() => {
    const latest = messages[messages.length - 1];
    if (latest && !latest.response && !processedIdsRef.current.has(latest.id)) {
      submitMessage(latest.prompt, latest.id);
    }
  }, [messages, submitMessage]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [renderTrigger]);

  const renderedMessages = useMemo(
    () =>
      messages.map((msg: CustomMessage, idx) => {
        const isLastMessage = idx === messages.length - 1;
        const isStreaming = streamingMessageId === msg.id;
        const hasResponse = msg.response && msg.response.trim().length > 0;

        return (
          <div key={msg.id} className="message-container">
            <div className="user-message">{msg.prompt}</div>
            {hasResponse ? (
              <div className="ai-message">{msg.response}</div>
            ) : isStreaming ? (
              <div className="ai-message streaming">
                {msg.response || "🤔 AI thinking..."}
              </div>
            ) : null}
          </div>
        );
      }),
    [messages, renderTrigger, streamingMessageId],
  );

  return (
    <div className="chat">
      <ScrollArea className="h-full w-full rounded-md">
        {renderedMessages}
        <div ref={scrollRef} />
      </ScrollArea>
    </div>
  );
};
