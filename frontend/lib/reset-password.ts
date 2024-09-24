export const resetPassword = async (token: string, password: string) => {
  const response = await fetch("http://localhost:3001/users/reset-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token,
      password,
    }),
  });
  return response;
};
