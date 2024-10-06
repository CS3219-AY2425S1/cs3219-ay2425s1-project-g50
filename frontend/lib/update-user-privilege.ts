export const updateUserPrivilege = async (
  jwtToken: string,
  id: string,
  isAdmin: boolean
) => {
  const body = { isAdmin };

  const response = await fetch(`http://localhost:3001/users/${id}/privilege`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${jwtToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return response;
};
