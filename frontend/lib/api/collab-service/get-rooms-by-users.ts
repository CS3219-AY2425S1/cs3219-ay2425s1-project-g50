import { AuthType, collabServiceUri } from "@/lib/api/api-uri";

export const getRoomsByUser = async (jwtToken: string, userId: string) => {
  const response = await fetch(
    `${collabServiceUri(window.location.hostname, AuthType.Private)}/collab/rooms/${userId}`,
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
