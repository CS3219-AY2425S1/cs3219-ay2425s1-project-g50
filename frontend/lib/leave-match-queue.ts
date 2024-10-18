import { matchingServiceUri } from "@/lib/api-uri";

export const leaveMatchQueue = async (
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
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response;
};
