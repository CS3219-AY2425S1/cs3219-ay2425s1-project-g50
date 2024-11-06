"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Chat from "./chat";
import QuestionDisplay from "./question-display";
import CodeEditor from "./code-editor";
import LoadingScreen from "@/components/common/loading-screen";
import { getQuestion } from "@/lib/api/question-service/get-question";
import { useAuth } from "@/app/auth/auth-context";
import { getQuestionId } from "@/lib/api/collab-service/get-questionId";
import { Question } from "@/lib/schemas/question-schema";

export default function CollabRoom({ roomId }: { roomId: string }) {
  const auth = useAuth();
  const token = auth?.token;

  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuestion() {
      try {
        // Call to the collab microservice to get questionId by roomId
        const response = await getQuestionId(roomId);
        const data = await response.json();

        if (data.questionId) {
          // Fetch the question details using the questionId
          if (token) {
            const questionResponse = await getQuestion(token, data.questionId);
            const questionData = await questionResponse.json();
            setQuestion(questionData);
          } else {
            console.error("Token is not available");
          }
        }
      } catch (error) {
        console.error("Error fetching question:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchQuestion();
  }, [roomId]);

  return (
    <div className="h-full flex flex-col mx-4 p-4">
      <header className="flex justify-between border-b">
        <h1 className="text-2xl font-bold mb-4">Collab Room {roomId}</h1>
        <Button variant="destructive">
          Leave Room
          <X className="ml-2" />
        </Button>
      </header>
      <div className="flex flex-1">
        <div className="w-2/5 p-4 flex flex-col space-y-4">
          {loading ? (
            <LoadingScreen />
          ) : (
            <QuestionDisplay question={question} />
          )}
          <Chat roomId={roomId} />
        </div>
        <CodeEditor roomId={roomId} />
      </div>
    </div>
  );
}
