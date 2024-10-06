"use client";

import { useAuth } from "@/app/auth/auth-context";
import { useEffect, useState, ChangeEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import { Question, QuestionArraySchema } from "@/lib/schemas/question-schema";
import LoadingScreen from "@/components/common/loading-screen";
import DeleteQuestionModal from "@/components/questions/delete-question-modal";
import QuestionTable from "@/components/questions/questions-table";
import QuestionFilter from "@/components/questions/question-filter";
import { Button } from "@/components/ui/button";
import { PlusIcon, Upload } from "lucide-react";
import { useToast } from "@/components/hooks/use-toast";
import {
  CreateQuestion,
  CreateQuestionArraySchema,
} from "@/lib/schemas/question-schema";
import QuestionFormModal from "./question-form-modal";
import { updateQuestion } from "@/lib/update-question";

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

  const searchParams = useSearchParams();
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [complexity, setComplexity] = useState(
    searchParams.get("complexity") || ""
  );

  const [search, setSearch] = useState(searchParams.get("search") || "");

  const { data, isLoading, mutate } = useSWR(
    `http://localhost:8000/questions?category=${encodeURIComponent(category)}&complexity=${encodeURIComponent(complexity)}&search=${encodeURIComponent(search)}`,
    fetcher,
    {
      keepPreviousData: true,
    }
  );

  const [questions, setQuestions] = useState<Question[]>([]);
  const [showEditViewModal, setShowEditViewModal] = useState<boolean>(false);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question>();

  useEffect(() => {
    setQuestions(data ?? []);
  }, [data]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    if (complexity) {
      params.set("complexity", complexity);
    } else {
      params.delete("complexity");
    }
    if (search) {
      params.set("search", search);
    } else {
      params.delete("search");
    }
    router.push(`?${params.toString()}`);
  }, [category, complexity, search, router, searchParams]);

  const handleView = (question: Question) => {
    setSelectedQuestion(question);
    setShowEditViewModal(true);
  };

  const handleCreateNewQuestion = () => {
    setShowCreateModal(true);
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
  };

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
      setSelectedQuestion(undefined);
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

  const handleEdit = async (question: Question) => {
    const response = await updateQuestion(question);
    if (!response.ok) {
      toast({
        title: "Unknown Error",
        description: "An unexpected error has occurred",
        variant: "destructive",
      });
    }
    switch (response.status) {
      case 200:
        toast({
          title: "Success",
          description: "Question updated successfully!",
          variant: "success",
        });
        break;
      case 404:
        toast({
          title: "Question not found",
          description: "Question with specified ID not found",
          variant: "destructive",
        });
        return;
      case 409:
        toast({
          title: "Duplicated title",
          description: "The title you entered is already in use",
          variant: "destructive",
        });
        return;
    }

    mutate();
    setShowEditViewModal(false);
  };

  const handleCreate = async (newQuestion: Question) => {
    try {
      const response = await fetch("http://localhost:8000/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newQuestion.title,
          description: newQuestion.description,
          category: newQuestion.category,
          complexity: newQuestion.complexity,
        }),
      });

      if (!response.ok) {
        if (response.status == 409) {
          throw new Error("A question with this title already exists.");
        }
      }

      toast({
        title: "Success",
        description: "Question created successfully!",
        variant: "success",
        duration: 3000,
      });

      setShowCreateModal(false);
      mutate();
    } catch (err) {
      toast({
        title: "An error occured!",
        description:
          err instanceof Error ? err.message : "An unknown error occurred",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  const handleCategoryChange = (newSearch: string) => {
    setCategory(newSearch);
  };

  const handleComplexityChange = (newComplexity: string) => {
    if (newComplexity === "all") {
      newComplexity = "";
    }
    setComplexity(newComplexity);
  };

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
  };

  const handleReset = () => {
    setSearch("");
    setCategory("");
    setComplexity("");
    router.push("");
  };

  if (isLoading && !data) {
    return <LoadingScreen />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Question Listing</h1>
      {auth?.user?.isAdmin && (
        <div className="flex justify-between mb-4">
          <div>
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
          <div>{createNewQuestion()}</div>
        </div>
      )}
      <QuestionFilter
        category={category}
        onCategoryChange={handleCategoryChange}
        complexity={complexity}
        onComplexityChange={handleComplexityChange}
        search={search}
        onSearchChange={handleSearchChange}
        onReset={handleReset}
      />
      <QuestionTable
        data={questions}
        isAdmin={auth?.user?.isAdmin ?? false}
        handleView={handleView}
        handleDelete={handleDelete}
      />
      <DeleteQuestionModal
        key={`delete${selectedQuestion?.id}`}
        showDeleteModal={showDeleteModal}
        questionTitle={selectedQuestion?.title ?? ""}
        handleDeleteQuestion={handleDeleteQuestion}
        setShowDeleteModal={setShowDeleteModal}
      />
      <QuestionFormModal
        key={`edit${selectedQuestion?.id}`}
        showModal={showEditViewModal}
        setShowModal={setShowEditViewModal}
        initialData={selectedQuestion}
        isAdmin={auth?.user?.isAdmin}
        handleSubmit={handleEdit}
        submitButtonText="Save Changes"
      />
      <QuestionFormModal
        showModal={showCreateModal}
        setShowModal={setShowCreateModal}
        isAdmin={auth?.user?.isAdmin}
        handleSubmit={handleCreate}
        submitButtonText="Create Question"
      />
    </div>
  );
}
