"use client";

import QuestionForm from "@/components/questions/question-form";
import { useAuth } from "@/app/auth/auth-context";

export default function QuestionCreate() {
  const auth = useAuth();

  const handleCreate = () => {
    // Todo: Implement
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
