import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root (one level up from src/)
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
import express from "express";
import cors from "cors";
import {
  HumanMessage,
  AIMessage,
  SystemMessage,
} from "@langchain/core/messages";
import { graph } from "./memory_agent/graph.js";
console.log(
  "OPENAI_API_KEY loaded:",
  process.env.OPENAI_API_KEY ? "YES ✓" : "NO ✗",
);
const app = express();
const PORT = process.env.SERVER_PORT;

app.use(cors());
app.use(express.json());

type ClientMsg = { role: "user" | "assistant" | "system"; content: string };

function toLangChainMessage(m: ClientMsg) {
  if (m.role === "user") return new HumanMessage(m.content);
  if (m.role === "assistant") return new AIMessage(m.content);
  return new SystemMessage(m.content);
}

app.post("/api/chat", async (req, res) => {
  try {
    // console.log("Received request at /api/chat", req.body);
    const { messages, thread_id = "default" } = req.body;
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Access-Control-Allow-Origin", "*");
    const stream = await graph.stream(
      {
        messages: messages.map(toLangChainMessage),
      },
      {
        configurable: {
          thread_id: thread_id,
          userId: "user_1",
          model: "openai/gpt-4.1-nano", // Add this
          systemPrompt: `You are a helpful assistant`, // Add this
        },
        streamMode: "messages",
      },
    );

    for await (const chunk of stream) {
      // ✅ Extract the content from the chunk
      const messageChunk = chunk[0]; // AIMessageChunk is first element
      const content = messageChunk.content;

      // Only send if there's actual content
      if (content) {
        // console.log("Sending token:", content);
        res.write(`data: ${JSON.stringify({ token: content })}\n\n`);
      }
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error) {
    console.error(error);
    res.write(`data: ${JSON.stringify({ error: "Stream error" })}\n\n`);
    res.end();
  }
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
