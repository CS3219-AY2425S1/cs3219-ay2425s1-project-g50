"use client";

import { Question } from "@/lib/schemas/question-schema";
import QuestionForm from "@/components/questions/question-form";
import { useAuth } from "@/app/auth/auth-context";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/hooks/use-toast";

export default function QuestionCreate() {
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleCreate = async (newQuestion: Question) => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch("http://localhost:8000/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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

      const data = await response.json();
      console.log("Question created:", data);

      toast({
        title: "Success",
        description: "Question created successfully!",
        variant: "default",
        duration: 3000,
      });

      router.push(`/app/questions/`);
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create a New Question</h1>
      <QuestionForm
        isAdmin={auth?.user?.isAdmin}
        handleSubmit={handleCreate}
        submitButtonText="Create Question"
      />
    </div>
  );
}
