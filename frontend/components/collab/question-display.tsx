"use client";
import React from "react";
import clsx from "clsx";
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

export default function QuestionDisplay({
  className,
  date,
  question,
}: {
  roomId: string;
  className?: string;
  date?: Date;
  question: Question | null;
}) {
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
