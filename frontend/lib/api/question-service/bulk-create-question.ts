import { CreateQuestion } from "@/lib/schemas/question-schema";
import { questionServiceUri } from "../api-uri";

export const bulkCreateQuestion = async (
  jwtToken: string,
  questions: CreateQuestion[]
) => {
  const response = await fetch(
    `${questionServiceUri(window.location.hostname)}/questions/batch-upload`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(questions),
    }
  );
  return response;
};
