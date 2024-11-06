import { AuthType, userServiceUri } from "@/lib/api/api-uri";

export const resetPassword = async (token: string, password: string) => {
  const response = await fetch(
    `${userServiceUri(window.location.hostname, AuthType.Public)}/users/reset-password`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        password,
      }),
    }
  );
  return response;
};
