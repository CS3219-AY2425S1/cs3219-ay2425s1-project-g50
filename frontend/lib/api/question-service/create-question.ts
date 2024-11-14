import { AuthType, questionServiceUri } from "@/lib/api/api-uri";
import { CreateQuestion } from "@/lib/schemas/question-schema";

export const createQuestion = async (
  jwtToken: string,
  question: CreateQuestion
) => {
  const response = await fetch(
    `${questionServiceUri(window.location.hostname, AuthType.Admin)}/questions`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(question),
    }
  );
  return response;
};
