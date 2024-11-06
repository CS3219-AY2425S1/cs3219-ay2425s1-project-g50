import { AuthType, matchingServiceWebSockUri } from "@/lib/api/api-uri";

export const subscribeMatch = async (
  userId: string,
  category: string,
  complexity: string
) => {
  const params = new URLSearchParams({
    topic: category,
    difficulty: complexity,
  });
  return new WebSocket(
    `${matchingServiceWebSockUri(window.location.hostname, AuthType.Public)}/match/subscribe/${userId}?${params}`
  );
};
