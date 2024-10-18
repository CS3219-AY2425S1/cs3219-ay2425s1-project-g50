import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface SelectionSummaryProps {
  selectedDifficulty: string;
  selectedTopic: string;
}

export function SelectionSummary({
  selectedDifficulty,
  selectedTopic,
}: SelectionSummaryProps) {
  return (
    <Alert className="w-full max-w-2xl mx-auto mt-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Selection Summary</AlertTitle>
      <AlertDescription>
        <p>Difficulty: {selectedDifficulty || "None selected"}</p>
        <p>Topic: {selectedTopic || "None selected"}</p>
      </AlertDescription>
    </Alert>
  );
}
