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
import { useToast } from "@/components/hooks/use-toast";
import Link from "next/link";

export default function CollabRoom({ roomId }: { roomId: string }) {
  const auth = useAuth();
  const token = auth?.token;
  const { toast } = useToast();

  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState<string>("");

  useEffect(() => {
    async function fetchQuestion() {
      try {
        if (!auth || !auth.token) {
          toast({
            title: "Access denied",
            description: "No authentication token found",
            variant: "destructive",
          });
          return;
        }

        // Call to the collab microservice to get questionId by roomId
        const response = await getQuestionId(auth.token, roomId);
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
    <div className="h-screen flex flex-col mx-4 p-4 overflow-hidden">
      <header className="flex justify-between border-b">
        <h1 className="text-2xl font-bold mb-4">Collab Room {roomId}</h1>
        <Link href="/app/history">
          <Button variant="destructive">
            Leave Room
            <X className="ml-2" />
          </Button>
        </Link>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <div className="w-2/5 p-4 flex flex-col space-y-4 overflow-hidden">
          {loading ? (
            <LoadingScreen />
          ) : (
            <QuestionDisplay question={question} />
          )}
          <Chat roomId={roomId} question={question} code={code} />
        </div>
        <CodeEditor roomId={roomId} setCode={setCode} />
      </div>
    </div>
  );
}
