export const signUp = async (
  username: string,
  email: string,
  password: string
) => {
  const response = await fetch("http://34.124.183.106:3001/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      email,
      password,
    }),
  });
  return response;
};
