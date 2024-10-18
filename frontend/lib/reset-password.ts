import { userServiceUri } from "@/lib/api-uri";

export const resetPassword = async (token: string, password: string) => {
  const response = await fetch(
    `${userServiceUri(window.location.hostname)}/users/reset-password`,
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
