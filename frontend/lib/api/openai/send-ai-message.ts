import { Message } from "@/components/collab/chat";
import { AuthType, collabServiceUri } from "@/lib/api/api-uri";

export const sendAiMessage = async (jwtToken: string, messages: Message[]) => {
  const apiMessages = messages.map((msg) => ({
    role: `${msg.userId === "assistant" || msg.userId === "system" ? msg.userId : "user"}`,
    content: msg.text,
  }));
  const response = await fetch(
    `${collabServiceUri(window.location.hostname, AuthType.Private)}/collab/send-ai-message`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages: apiMessages }),
    }
  );
  return response;
};
