import { questionServiceUri } from "@/lib/api/api-uri";
import { Question } from "@/lib/schemas/question-schema";

export const updateQuestion = async (jwtToken: string, question: Question) => {
  const response = await fetch(
    `${questionServiceUri(window.location.hostname)}/questions/${question.id}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(question),
    }
  );
  return response;
};
