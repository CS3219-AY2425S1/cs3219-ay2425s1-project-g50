import { AuthType, userServiceUri } from "@/lib/api/api-uri";

export const updateUser = async (
  jwtToken: string,
  id: string,
  username?: string,
  email?: string,
  password?: string,
  skillLevel?: string
) => {
  if (!username && !email && !password && !skillLevel) {
    throw new Error("Require at least one field");
  }

  const body = { username, email, password, skillLevel };

  const response = await fetch(
    `${userServiceUri(window.location.hostname, AuthType.Public)}/users/${id}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );
  return response;
};
