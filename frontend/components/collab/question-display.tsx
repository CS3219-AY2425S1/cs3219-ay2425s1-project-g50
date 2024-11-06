"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Question } from "@/lib/schemas/question-schema";

const difficultyColors = {
  Easy: "bg-green-500",
  Medium: "bg-yellow-500",
  Hard: "bg-red-500",
};

export default function QuestionDisplay({ question }: { question: Question | null }) {

  if (!question) {
    return <div>Question not found</div>;
  }

  return (
    <Card className="flex-shrink-0">
      <CardHeader>
        <CardTitle>{question.title}</CardTitle>
        <CardDescription className="flex items-center space-x-2">
          <span>{question.categories}</span>
          <Badge className={`${difficultyColors[question.complexity]}`}>
            {question.complexity}
          </Badge>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>{question.description}</p>
      </CardContent>
    </Card>
  );
}
