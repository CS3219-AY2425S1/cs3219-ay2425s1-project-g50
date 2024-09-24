"use client";

import { Question } from "@/lib/schemas/question-schema";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AutosizeTextarea } from "../ui/autosize-textarea";

interface QuestionFormProps {
  initialData?: Question;
  isAdmin: boolean | undefined;
  handleSubmit: (question: Question) => void;
  submitButtonText: string;
}

const QuestionForm: React.FC<QuestionFormProps> = ({ ...props }) => {
  const [question, setQuestion] = useState<Question>(
    props.initialData || {
      id: "",
      title: "",
      category: "",
      complexity: "easy",
      description: "",
    }
  );

  useEffect(() => {
    if (props.initialData) {
      setQuestion(props.initialData);
    }
  }, [props.initialData]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    props.handleSubmit(question);
  };

  return (
    <form onSubmit={onSubmit}>
      <Card>
        <CardHeader>
          <CardTitle className="m-4">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={question.title}
              className="mt-2"
              onChange={(e) =>
                setQuestion({ ...question, title: e.target.value })
              }
              disabled={!props.isAdmin}
              required
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="m-4">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={question.category}
              className="mt-2"
              onChange={(e) =>
                setQuestion({ ...question, category: e.target.value })
              }
              disabled={!props.isAdmin}
              required
            />
          </div>
          <div className="m-4">
            <Label htmlFor="complexity">Complexity</Label>
            <div className="mt-2">
              {props.isAdmin ? (
                <Select
                  value={question.complexity}
                  onValueChange={(e) =>
                    setQuestion({ ...question, complexity: e })
                  }
                  disabled={!props.isAdmin}
                >
                  <SelectTrigger id="complexity">
                    <SelectValue placeholder="Select complexity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id="complexity"
                  value={question.complexity}
                  onChange={(e) =>
                    setQuestion({ ...question, complexity: e.target.value })
                  }
                  disabled={!props.isAdmin}
                />
              )}
            </div>
          </div>
          <div className="m-4">
            <Label htmlFor="description">Description</Label>
            <AutosizeTextarea
              id="description"
              value={question.description}
              className="mt-2"
              minHeight={200}
              onChange={(e) =>
                setQuestion({ ...question, description: e.target.value })
              }
              disabled={!props.isAdmin}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          {props.isAdmin && (
            <Button type="submit">{props.submitButtonText}</Button>
          )}
        </CardFooter>
      </Card>
    </form>
  );
};

export default QuestionForm;
