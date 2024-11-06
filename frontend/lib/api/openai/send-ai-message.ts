import { collabServiceUri } from "@/lib/api/api-uri";
import { Message } from "@/components/collab/chat";

export const sendAiMessage = async (messages: Message[]) => {
  const apiMessages = messages.map((msg) => ({
    role: `${(msg.userId === "assistant" || msg.userId === "system") ? msg.userId : "user"}`,
    content: msg.text,
  }));
  const response = await fetch(
    `${collabServiceUri(window.location.hostname)}/collab/send-ai-message`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages: apiMessages }),
    }
  );
  return response;
};
