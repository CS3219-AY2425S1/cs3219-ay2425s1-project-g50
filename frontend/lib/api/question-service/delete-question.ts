import { AuthType, questionServiceUri } from "@/lib/api/api-uri";

export const deleteQuestion = async (jwtToken: string, question_id: string) => {
  const response = await fetch(
    `${questionServiceUri(window.location.hostname, AuthType.Admin)}/questions/${question_id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
  );
  return response;
};
