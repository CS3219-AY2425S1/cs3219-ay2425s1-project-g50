import { Question } from "./schemas/question-schema";

export const updateQuestion = async (question: Question) => {
  const response = await fetch(
    `http://34.124.183.106:8000/questions/${question.id}`,
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
