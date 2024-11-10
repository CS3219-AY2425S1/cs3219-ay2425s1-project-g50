"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Chat from "./chat";
import QuestionDisplay from "./question-display";
import CodeEditor from "./code-editor";
import Link from "next/link";
import { Question } from "@/lib/schemas/question-schema";

export default function CollabRoom({ roomId }: { roomId: string }) {
  const [code, setCode] = useState<string>("");
  const [exposedQuestion, setExposedQuestion] = useState<Question | null>(null);
  return (
    <div className="h-screen flex flex-col mx-4 p-4 overflow-hidden">
      <header className="flex justify-between border-b">
        <h1 className="text-2xl font-bold mb-4">Collaboration Room</h1>
        <Link href="/app/history">
          <Button variant="destructive">
            Leave Room
            <X className="ml-2" />
          </Button>
        </Link>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <div className="w-2/5 p-4 flex flex-col space-y-4 overflow-hidden">
          <QuestionDisplay
            roomId={roomId}
            setExposedQuestion={setExposedQuestion}
          />
          <Chat roomId={roomId} question={exposedQuestion} code={code} />
        </div>
        <CodeEditor roomId={roomId} setCode={setCode} />
      </div>
    </div>
  );
}
