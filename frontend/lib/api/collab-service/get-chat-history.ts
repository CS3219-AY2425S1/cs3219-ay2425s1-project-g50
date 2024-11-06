import { AuthType, collabServiceUri } from "@/lib/api/api-uri";

export const getChatHistory = async (jwtToken: string, roomId: string) => {
  const response = await fetch(
    `${collabServiceUri(window.location.hostname, AuthType.Private)}/collab/chat-history/${roomId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response;
};
