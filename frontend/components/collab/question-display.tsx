"use client";
import React, { useState, useEffect } from "react";
import clsx from "clsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getQuestion } from "@/lib/api/question-service/get-question";
import { useAuth } from "@/app/auth/auth-context";
import { getQuestionId } from "@/lib/api/collab-service/get-questionId";
import { useToast } from "@/components/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Question } from "@/lib/schemas/question-schema";
import LoadingScreen from "@/components/common/loading-screen";

const difficultyColors = {
  Easy: "bg-green-500",
  Medium: "bg-yellow-500",
  Hard: "bg-red-500",
};

export default function QuestionDisplay({
  className,
  date,
  roomId,
  setExposedQuestion,
}: {
  className?: string;
  date?: Date;
  roomId: string;
  setExposedQuestion?: (question: Question) => void;
}) {
  const auth = useAuth();
  const token = auth?.token;
  const { toast } = useToast();

  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);

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
            if (setExposedQuestion) {
              setExposedQuestion(questionData);
            }
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

  if (loading) {
    return <LoadingScreen />;
  }

  if (!question) {
    return <div>Question not found</div>;
  }
  date && console.log(date.toLocaleString());
  date && console.log(date.toLocaleString("en-GB"));

  return (
    <Card className={clsx("flex-shrink-0", className)}>
      <CardHeader>
        <CardTitle>{question.title}</CardTitle>
        <CardDescription className="flex items-center justify-between">
          <div className="flex space-x-2">
            <span>{question.categories}</span>
            <Badge className={`${difficultyColors[question.complexity]}`}>
              {question.complexity}
            </Badge>
          </div>
          {date && <span>{new Date(date).toLocaleString()}</span>}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>{question.description}</p>
      </CardContent>
    </Card>
  );
}
