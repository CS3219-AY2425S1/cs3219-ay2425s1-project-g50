import { matchingServiceUri } from "@/lib/api/api-uri";

export const joinMatchQueue = async (
  jwtToken: string,
  userId: string,
  category: string,
  complexity: string
) => {
  const params = new URLSearchParams({
    topic: category,
    difficulty: complexity,
  }).toString();
  const response = await fetch(
    `${matchingServiceUri(window.location.hostname)}/match/queue/${userId}?${params}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response;
};
