"use client";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";
import { editor as MonacoEditor } from "monaco-types";

import React, { useEffect, useMemo, useState } from "react";
import Editor from "@monaco-editor/react";
import { yjsWebSockUri } from "@/lib/api/api-uri";

export default function MonacoEdit({ roomId }: { roomId: string }) {
  const ydoc = useMemo(() => new Y.Doc(), []);
  const [editor, setEditor] =
    useState<MonacoEditor.IStandaloneCodeEditor | null>(null);
  const [provider, setProvider] = useState<WebsocketProvider | null>(null);

  // this effect manages the lifetime of the Yjs document and the provider
  useEffect(() => {
    const provider = new WebsocketProvider(
      yjsWebSockUri(window.location.hostname),
      roomId,
      ydoc
    );
    console.log(provider);
    setProvider(provider);
    return () => {
      provider?.destroy();
      ydoc.destroy();
    };
  }, [ydoc, roomId]);

  // this effect manages the lifetime of the editor binding
  useEffect(() => {
    if (provider == null || editor == null) {
      console.log(provider, editor);
      return;
    }
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

  return (
    <Editor
      height="90vh"
      defaultValue="// some comment"
      defaultLanguage="javascript"
      onMount={(editor) => {
        setEditor(editor);
      }}
    />
  );
}
