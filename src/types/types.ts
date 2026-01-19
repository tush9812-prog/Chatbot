export type CustomMessage={
  id: string,
  role: "User" | "assistant",
  prompt: string,
  response?:any,
  requestId: string
  timestamp: number
}