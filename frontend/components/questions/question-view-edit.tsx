"use client";

import { Question, QuestionSchema } from "@/lib/schemas/question-schema";
import useSWR from "swr";
import QuestionForm from "./question-form";
import { useAuth } from "@/app/auth/auth-context";
import { useEffect, useState } from "react";

const fetcher = async (url: string): Promise<Question> => {
  const token = localStorage.getItem("jwtToken");
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(String(response.status));
  }

  const data = await response.json();

  return QuestionSchema.parse(data);
};

export default function QuestionViewEdit({
  questionId,
}: {
  questionId: string;
}) {
  const auth = useAuth();

  const { data } = useSWR(
    `http://localhost:8000/questions/${questionId}`,
    fetcher
  );

  const [question, setQuestion] = useState<Question>();

  useEffect(() => {
    setQuestion(data);
  }, [data]);

  const handleEdit = (question: Question) => {
    // Todo: Implement
    question
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{question?.title}</h1>
      <QuestionForm
        data={question}
        isAdmin={auth?.user?.isAdmin}
        handleSubmit={handleEdit}
      />
    </div>
  );
}
