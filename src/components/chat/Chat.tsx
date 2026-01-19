import "./Chat.css";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Message } from "@langchain/langgraph-sdk";
import type { CustomMessage } from "../../types/types";
import { useStream } from "@langchain/langgraph-sdk/react";
import { useCallback, useEffect, useRef, useMemo, useState } from "react";

interface ChatProps {
  messages: CustomMessage[];
  onMessageUpdate: (id: string, response: string) => void;
}

export const Chat = ({ messages, onMessageUpdate }: ChatProps) => {
  const streamConfig = useMemo(
    () => ({
      assistantId: "agent",
      apiUrl: "http://localhost:2024",
      apiKey: import.meta.env.VITE_LANGCHAIN_API_KEY,
      streamMode: "messages",
    }),
    [],
  );

  const stream = useStream(streamConfig);
  const processedIdsRef = useRef<Set<string>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentMessageIdRef = useRef<string | null>(null);
  const onMessageUpdateRef = useRef(onMessageUpdate);
  const [renderTrigger, setRenderTrigger] = useState(0);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(
    null,
  );
  const completedStreamIdsRef = useRef<Set<string>>(new Set());
  const startStreamIndexRef = useRef<number>(0); // ✅ ADD THIS

  useEffect(() => {
    onMessageUpdateRef.current = onMessageUpdate;
  }, [onMessageUpdate]);

  const submitMessage = useCallback(
    (content: string, id: string) => {
      if (!processedIdsRef.current.has(id)) {
        processedIdsRef.current.add(id);
        currentMessageIdRef.current = id;
        setStreamingMessageId(id);

        // ✅ CRITICAL: Remember stream.messages length BEFORE submitting
        startStreamIndexRef.current = stream.messages.length;

        stream.submit({
          messages: [{ content, type: "human" }],
          config: {
            configurable: {
              maxTokens: 1500,
              temperature: 0.8,
            },
          },
        });
      }
    },
    [stream],
  );

  useEffect(() => {
    if (stream.messages.length > 0) {
      // ✅ CRITICAL FIX: Only process messages AFTER the start index
      if (stream.messages.length <= startStreamIndexRef.current) {
        return;
      }

      const latestMsg = stream.messages[stream.messages.length - 1];

      if (latestMsg.type === "ai" && currentMessageIdRef.current) {
        const aiResponse = latestMsg.content as string;

        onMessageUpdateRef.current(currentMessageIdRef.current, aiResponse);
        setRenderTrigger((prev) => prev + 1);

        if (!stream.isLoading) {
          const completedId = currentMessageIdRef.current;
          completedStreamIdsRef.current.add(completedId);

          currentMessageIdRef.current = null;
          setStreamingMessageId(null);
        }
      }
    }
  }, [stream.messages, stream.isLoading]);

  useEffect(() => {
    const latest = messages[messages.length - 1];
    if (latest && !latest.response && !processedIdsRef.current.has(latest.id)) {
      submitMessage(latest.prompt, latest.id);
    }
  }, [messages.length, submitMessage]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [renderTrigger]);

  const renderedMessages = useMemo(
    () =>
      messages.map((msg: CustomMessage, idx) => {
        const isLastMessage = idx === messages.length - 1;
        const isCurrentlyStreaming = streamingMessageId === msg.id;
        const hasResponse = msg.response && msg.response.trim().length > 0;
        const wasCompleted = completedStreamIdsRef.current.has(msg.id);

        const isNewMessageWithStaleResponse =
          isLastMessage && !wasCompleted && !isCurrentlyStreaming;

        const showResponse =
          hasResponse &&
          (isCurrentlyStreaming || wasCompleted) &&
          !isNewMessageWithStaleResponse;
        const showLoading =
          !hasResponse && (isLastMessage || isCurrentlyStreaming);

        return (
          <div key={msg.id} className="message-container">
            <div className="user-message">{msg.prompt}</div>
            {showResponse ? (
              <div className="ai-message">{msg.response}</div>
            ) : showLoading ? (
              <div className="ai-message loading">🤔 AI thinking...</div>
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
