import { Question } from "./schemas/question-schema";

export const updateQuestion = async (question: Question) => {
  const response = await fetch(
    `http://localhost:8000/questions/${question.id}`,
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
