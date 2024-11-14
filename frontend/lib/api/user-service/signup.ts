import { AuthType, userServiceUri } from "@/lib/api/api-uri";

export const signUp = async (
  username: string,
  email: string,
  password: string
) => {
  const response = await fetch(
    `${userServiceUri(window.location.hostname, AuthType.Public)}/users`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    }
  );
  return response;
};
