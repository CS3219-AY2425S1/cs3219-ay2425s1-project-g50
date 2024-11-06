"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/app/auth/auth-context";
import LoadingScreen from "@/components/common/loading-screen";
import { sendAiMessage } from "@/lib/api/openai/send-ai-message";

export interface Message {
  id: string;
  userId: string;
  text: string;
  timestamp: Date;
}

export default function Chat({ roomId }: { roomId: string }) {
  const auth = useAuth();
  const own_user_id = auth?.user?.id;
  const [socket, setSocket] = useState<Socket | null>(null);
  const [chatTarget, setChatTarget] = useState<string>("partner");
  const [newMessage, setNewMessage] = useState<string>("");
  const [partnerMessages, setPartnerMessages] = useState<Message[]>([]);
  const [aiMessages, setAiMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!auth?.user?.id) return; // Avoid connecting if user is not authenticated

    const socketInstance = io(
      process.env.NEXT_PUBLIC_COLLAB_SERVICE_URL || "http://localhost:3002",
      {
        auth: { userId: own_user_id },
      }
    );

    socketInstance.on("connect", () => {
      console.log("Connected to Socket.IO");
      setIsConnected(true);
      socketInstance.emit("joinRoom", roomId);
    });

    socketInstance.on("disconnect", () => {
      console.log("Disconnected from Socket.IO");
      setIsConnected(false);
    });

    socketInstance.on("chatMessage", (message: Message) => {
      setPartnerMessages((prev) => [...prev, message]);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [roomId, own_user_id, auth?.user?.id]);

  useEffect(() => {
    const scrollWithDelay = () => {
      setTimeout(() => {
        if (lastMessageRef.current) {
          lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 100); // Delay to ensure the DOM is fully rendered
    };

    scrollWithDelay();
  }, [partnerMessages, aiMessages, chatTarget]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !socket || !isConnected || !own_user_id) return;

    const message = {
      id: crypto.randomUUID(),
      userId: own_user_id,
      text: newMessage,
      timestamp: new Date(),
    };

    if (chatTarget === "partner") {
      socket.emit("sendMessage", {
        roomId,
        userId: own_user_id,
        text: newMessage,
      });
    } else {
      setAiMessages((prev) => [...prev, message]);
      setNewMessage("");
      const response = await sendAiMessage(aiMessages.concat(message));
      const data = await response.json();
      const aiMessage = {
        id: crypto.randomUUID(),
        userId: "ai",
        text: data.data ? data.data : "An error occurred. Please try again.",
        timestamp: new Date(),
      };
      setAiMessages((prev) => [...prev, aiMessage]);
    }

    setNewMessage("");
  };

  const formatTimestamp = (date: Date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderMessage = (message: Message, isOwnMessage: boolean) => (
    <div
      key={message.id}
      className={`p-2 rounded-lg mb-2 max-w-[80%] ${
        isOwnMessage
          ? "ml-auto bg-blue-500 text-white"
          : "bg-gray-100 dark:bg-gray-800"
      }`}
    >
      <div className="text-sm">{message.text}</div>
      <div
        className={`text-xs ${isOwnMessage ? "text-blue-100" : "text-gray-500"}`}
      >
        {formatTimestamp(message.timestamp)}
      </div>
    </div>
  );

  if (!own_user_id) {
    return <LoadingScreen />;
  }

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Chat
          <span
            className={`h-2 w-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <Tabs
          value={chatTarget}
          onValueChange={setChatTarget}
          className="flex-col"
        >
          <TabsList className="flex-shrink-0 mb-2">
            <TabsTrigger value="partner">Partner Chat</TabsTrigger>
            <TabsTrigger value="ai">AI Chat</TabsTrigger>
          </TabsList>
          <TabsContent value="partner" className="h-full">
            <ScrollArea className="h-[calc(70vh-280px)]">
              <div className="pr-4 space-y-2">
                {partnerMessages.map((msg) =>
                  renderMessage(msg, msg.userId === own_user_id)
                )}
                <div ref={lastMessageRef} />
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="ai" className="h-full">
            <ScrollArea className="h-[calc(70vh-280px)]">
              <div className="pr-4 space-y-2">
                {aiMessages.map((msg) =>
                  renderMessage(msg, msg.userId === own_user_id)
                )}
                <div ref={lastMessageRef} />
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
        <div className="flex space-x-2 mt-4 pt-4 border-t">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={`Message ${chatTarget === "partner" ? "your partner" : "AI assistant"}...`}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            disabled={!isConnected}
          />
          <Button onClick={sendMessage} disabled={!isConnected}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
