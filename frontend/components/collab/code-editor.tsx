"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";
import { editor as MonacoEditor } from "monaco-types";
import Editor, { useMonaco } from "@monaco-editor/react";
import { yjsWebSockUri } from "@/lib/api/api-uri";

interface LanguageEntry {
  language: string;
  value: string;
}

const languages: Record<string, LanguageEntry> = {
  Javascript: {
    language: "javascript",
    value: "// some comment",
  },
  Python: {
    language: "python",
    value: "# some comment",
  },
  Java: {
    language: "java",
    value: "// some comment",
  },
  "C++": {
    language: "cpp",
    value: "// some comment",
  },
};

export default function CodeEditor({
  roomId,
  setCode,
}: {
  roomId: string;
  setCode: (value: string) => void;
}) {
  const monaco = useMonaco();
  const [language, setLanguage] = useState<string>("Javascript");
  const [theme, setTheme] = useState<string>("light");
  const ydoc = useMemo(() => new Y.Doc(), []);
  const [editor, setEditor] =
    useState<MonacoEditor.IStandaloneCodeEditor | null>(null);
  const [provider, setProvider] = useState<WebsocketProvider | null>(null);
  const languageMap = useMemo(() => ydoc.getMap("language"), [ydoc]);

  useEffect(() => {
    const provider = new WebsocketProvider(
      yjsWebSockUri(window.location.hostname),
      roomId,
      ydoc
    );
    setProvider(provider);
    return () => {
      provider?.destroy();
      ydoc.destroy();
    };
  }, [ydoc, roomId]);

  useEffect(() => {
    if (provider == null || editor == null) return;
    const monacoBinding = new MonacoBinding(
      ydoc.getText(),
      editor.getModel()!,
      new Set([editor]),
      provider?.awareness
    );
    return () => {
      monacoBinding.destroy();
    };
  }, [ydoc, provider, editor]);

  useEffect(() => {
    const handleLanguageChange = () => {
      const newLanguage = languageMap.get("selectedLanguage") as string;
      if (newLanguage && newLanguage !== language) {
        setLanguage(newLanguage);
      }
    };
    languageMap.set("selectedLanguage", language);
    languageMap.observe(handleLanguageChange);
    return () => {
      languageMap.unobserve(handleLanguageChange);
    };
  }, [languageMap, language]);

  useEffect(() => {
    if (editor && monaco) {
      const model = editor.getModel();
      if (model) {
        monaco.editor.setModelLanguage(model, languages[language]?.language);
      }
    }
  }, [language, editor, monaco]);

  useEffect(() => {
    if (monaco) {
      monaco.editor.setTheme(theme === "dark" ? "vs-dark" : "light");
    }
  }, [theme, monaco]);

  return (
    <div className="w-3/5 p-4">
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle>Code Editor</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <div className="h-1/8 mb-4 flex justify-between items-center">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-1/5">
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(languages).map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              variant={theme === "light" ? "secondary" : "default"}
            >
              {theme === "light" ? "Light" : "Dark"} Mode
            </Button>
          </div>
          <div className="flex-1 h-7/5">
            <Editor
              value={languages[language]?.value}
              language={languages[language]?.language}
              onMount={(editor) => {
                setEditor(editor);
              }}
              onChange={(value) => {
                setCode(value || "");
              }}
              theme={theme === "dark" ? "vs-dark" : "light"}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
