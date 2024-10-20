"use client";

import { useAuth } from "@/app/auth/auth-context";
import { useEffect, useState, ChangeEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import {
  CreateQuestionSchema,
  Question,
  QuestionArraySchema,
} from "@/lib/schemas/question-schema";
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
import { AuthType, questionServiceUri } from "@/lib/api/api-uri";
import { updateQuestion } from "@/lib/api/question-service/update-question";
import { createQuestion } from "@/lib/api/question-service/create-question";
import { deleteQuestion } from "@/lib/api/question-service/delete-question";
import { bulkCreateQuestion } from "@/lib/api/question-service/bulk-create-question";

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

  const getUriParams: () => string = () => {
    let uri = "?";
    if (complexity) {
      uri += `complexity=${encodeURIComponent(complexity)}&`;
    }
    if (search) {
      uri += `search=${encodeURIComponent(search)}&`;
    }
    if (category) {
      uri += `category=${encodeURIComponent(category)}`;
    }
    return uri;
  };

  const { data, isLoading, mutate } = useSWR(
    `${questionServiceUri(window.location.hostname, AuthType.Public)}/questions${getUriParams()}`,
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
    setQuestions(data || []);
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
    if (!auth || !auth.token) {
      return;
    }

    const response = await bulkCreateQuestion(auth.token, questions);

    const result = await response.json();
    switch (response.status) {
      case 200:
        toast({
          title: "Batch Upload Success",
          description: result.message,
          variant: "success",
          duration: 3000,
        });
        break;
      case 400:
        toast({
          title: "Batch Upload Failed",
          description: result.detail,
          variant: "destructive",
          duration: 5000,
        });
        return;
      default:
        toast({
          title: "Unknown Error",
          description: "An unexpected error has occurred",
          variant: "destructive",
          duration: 5000,
        });
        return;
    }

    mutate();
  };

  const handleDelete = (question: Question) => {
    setSelectedQuestion(question);
    setShowDeleteModal(true);
  };

  const handleDeleteQuestion = async () => {
    if (!selectedQuestion?.id || !auth || !auth.token) {
      return;
    }

    const response = await deleteQuestion(auth.token, selectedQuestion.id);
    switch (response.status) {
      case 200:
        toast({
          title: "Success",
          description: "Question deleted successfully!",
          variant: "success",
          duration: 3000,
        });
        break;
      case 404:
        toast({
          title: "Question not found",
          description: "Question with specified ID not found",
          variant: "destructive",
          duration: 5000,
        });
        break;
      default:
        toast({
          title: "Unknown Error",
          description: "An unexpected error has occurred",
          variant: "destructive",
          duration: 5000,
        });
    }

    mutate();
    setShowDeleteModal(false);
    setSelectedQuestion(undefined);
  };

  const handleEdit = async (question: Question) => {
    if (!auth || !auth.token) {
      return;
    }

    const response = await updateQuestion(auth.token, question);
    switch (response.status) {
      case 200:
        toast({
          title: "Success",
          description: "Question updated successfully!",
          variant: "success",
          duration: 3000,
        });
        break;
      case 404:
        toast({
          title: "Question not found",
          description: "Question with specified ID not found",
          variant: "destructive",
          duration: 5000,
        });
        return;
      case 409:
        toast({
          title: "Duplicated title",
          description: "The title you entered is already in use",
          variant: "destructive",
          duration: 5000,
        });
        return;
      default:
        toast({
          title: "Unknown Error",
          description: "An unexpected error has occurred",
          variant: "destructive",
          duration: 5000,
        });
    }

    mutate();
    setShowEditViewModal(false);
  };

  const handleCreate = async (newQuestion: Question) => {
    if (!auth || !auth.token) {
      return;
    }

    const response = await createQuestion(
      auth.token,
      CreateQuestionSchema.parse(newQuestion)
    );
    switch (response.status) {
      case 200:
        toast({
          title: "Success",
          description: "Question created successfully!",
          variant: "success",
          duration: 3000,
        });
        break;
      case 409:
        toast({
          title: "Duplicated title",
          description: "The title you entered is already in use",
          variant: "destructive",
          duration: 5000,
        });
        return;
      default:
        toast({
          title: "Unknown Error",
          description: "An unexpected error has occurred",
          variant: "destructive",
          duration: 5000,
        });
    }

    setShowCreateModal(false);
    mutate();
  };

  const handleCategoryChange = (newCategory: string) => {
    if (newCategory === "all") {
      newCategory = "";
    }
    setCategory(newCategory);
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
          <div>
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
          </div>
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
