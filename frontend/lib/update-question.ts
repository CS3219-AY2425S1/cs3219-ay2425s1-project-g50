import { questionServiceUri } from "@/lib/api-uri";
import { Question } from "@/lib/schemas/question-schema";

export const updateQuestion = async (question: Question) => {
  const response = await fetch(
    `${questionServiceUri(window.location.hostname)}/questions/${question.id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(question),
    }
  );
  return response;
};
