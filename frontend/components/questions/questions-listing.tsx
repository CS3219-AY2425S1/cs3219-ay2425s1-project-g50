"use client";

import { useAuth } from "@/app/auth/auth-context";
import QuestionTable from "@/components/questions/questions-table";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { Question, QuestionArraySchema } from "@/lib/schemas/question-schema";
import LoadingScreen from "@/components/common/loading-screen";
import DeleteQuestionModal from "@/components/questions/delete-question-modal";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useToast } from "@/components/hooks/use-toast";

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
  const { data, isLoading } = useSWR(
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
