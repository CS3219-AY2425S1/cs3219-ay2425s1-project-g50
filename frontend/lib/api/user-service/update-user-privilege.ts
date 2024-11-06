import { AuthType, userServiceUri } from "@/lib/api/api-uri";

export const updateUserPrivilege = async (
  jwtToken: string,
  id: string,
  isAdmin: boolean
) => {
  const body = { isAdmin };

  const response = await fetch(
    `${userServiceUri(window.location.hostname, AuthType.Public)}/users/${id}/privilege`,
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
