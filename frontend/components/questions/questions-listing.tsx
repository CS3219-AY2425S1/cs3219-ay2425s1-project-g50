"use client";

import { useAuth } from "@/app/auth/auth-context";
import QuestionTable from "@/components/questions/questions-table";
import { useEffect, useState, ChangeEvent } from "react";
import useSWR from "swr";
import { Question, QuestionArraySchema } from "@/lib/schemas/question-schema";
import LoadingScreen from "@/components/common/loading-screen";
import DeleteQuestionModal from "@/components/questions/delete-question-modal";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PlusIcon, Upload } from "lucide-react";
import { useToast } from "@/components/hooks/use-toast";
import {
  CreateQuestion,
  CreateQuestionArraySchema,
} from "@/lib/schemas/question-schema";

const fetcher = async (url: string): Promise<Question[]> => {
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

  return QuestionArraySchema.parse(data.questions);
};

export default function QuestionListing() {
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { data, isLoading, mutate } = useSWR(
    "http://localhost:8000/questions",
    fetcher
  );

  const [questions, setQuestions] = useState<Question[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  );

  useEffect(() => {
    setQuestions(data ?? []);
  }, [data]);

  const handleView = (question: Question) => {
    router.push(`/app/questions/${question.id}`);
  };

  const handleCreateNewQuestion = () => {
    router.push(`/app/questions/create`);
  };

  const createNewQuestion = () => {
    return (
      <div className="flex justify-end">
        <Button
          variant="outline"
          className="ml-2"
          onClick={() => handleCreateNewQuestion()}
        >
          <PlusIcon className="mr-2" />
          Create New Question
        </Button>
      </div>
    );
  }

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        try {
          const result = e.target?.result;
          if (typeof result === "string") {
            const parsedData = JSON.parse(result);
            const questions = CreateQuestionArraySchema.parse(parsedData);
            handleBatchUpload(questions);
          }
        } catch (error) {
          toast({
            title: "File Parse Error",
            description: "Failed to parse or validate the JSON file.",
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    }
  };

  const handleBatchUpload = async (questions: CreateQuestion[]) => {
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await fetch(
        "http://localhost:8000/questions/batch-upload",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(questions),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to upload questions");
      }

      const result = await response.json();
      toast({
        title: "Batch Upload Success",
        description: result.message,
      });

      mutate();
    } catch (error) {
      toast({
        title: "Batch Upload Failed",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred while uploading questions.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = (question: Question) => {
    setSelectedQuestion(question);
    setShowDeleteModal(true);
  };

  const handleDeleteQuestion = async () => {
    if (!selectedQuestion) return;

    try {
      const response = await fetch(
        `http://localhost:8000/questions/${selectedQuestion.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete the question");
      }

      setQuestions((prevQuestions) =>
        prevQuestions.filter((q) => q.id !== selectedQuestion.id)
      );

      toast({
        title: "Success",
        description: "Question deleted successfully!",
        variant: "success",
        duration: 3000,
      });

      setShowDeleteModal(false);
      setSelectedQuestion(null);
    } catch (err) {
      toast({
        title: "An error occurred!",
        description:
          err instanceof Error ? err.message : "An unknown error occurred",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Question Listing</h1>
      {auth?.user?.isAdmin && createNewQuestion()}
      {auth?.user?.isAdmin && (
        <div className="mb-4">
          <input
            type="file"
            accept=".json"
            onChange={handleFileSelect}
            style={{ display: "none" }}
            id="batch-upload-input"
          />
          <label htmlFor="batch-upload-input">
            <Button variant="outline" asChild>
              <span>
                <Upload className="mr-2 h-4 w-4" /> Upload questions from JSON
                file
              </span>
            </Button>
          </label>
        </div>
      )}
      <QuestionTable
        data={questions}
        isAdmin={auth?.user?.isAdmin ?? false}
        handleView={handleView}
        handleDelete={handleDelete}
      />
      <DeleteQuestionModal
        showDeleteModal={showDeleteModal}
        questionTitle={selectedQuestion?.title ?? ""}
        handleDeleteQuestion={handleDeleteQuestion}
        setShowDeleteModal={setShowDeleteModal}
      />
    </div>
  );
}
