"use client";
import React, { useEffect, useState } from "react";
import { useToast } from "@/components/hooks/use-toast";
import { useAuth } from "@/app/auth/auth-context";
import { getRoomsByUser } from "@/lib/api/collab-service/get-rooms-by-users";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import QuestionDisplay from "./question-display";
import LoadingScreen from "../common/loading-screen";

interface Room {
  users: string[];
  roomId: string;
  questionId: string;
  lastUpdated: Date;
}
export default function UserRooms() {
  const auth = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState<Room[] | null>(null);

  useEffect(() => {
    async function fetchRoomsByUser() {
      try {
        if (!auth || !auth.token || !auth?.user?.id) {
          toast({
            title: "Access denied",
            description: "No authentication token found",
            variant: "destructive",
          });
          return;
        }
        const response = await getRoomsByUser(auth?.token, auth?.user?.id);
        const tempRooms = await response.json();
        const sortedRooms = tempRooms.sort((a: Room, b: Room) => {
          return (
            new Date(b.lastUpdated).getTime() -
            new Date(a.lastUpdated).getTime()
          );
        });
        setRooms(sortedRooms);
      } finally {
        setLoading(false);
      }
    }

    fetchRoomsByUser();
  }, [auth]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Card className="w-full max-w-4xl mx-auto my-4">
      <CardHeader>
        <CardTitle>Historical Rooms</CardTitle>
        <CardDescription>Look at rooms you have joined before</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-y-2">
        {rooms?.map((room) => (
          <Link
            href={`/app/collab/${room.roomId}`}
            className="w-full my-2"
            key={room.roomId}
          >
            <QuestionDisplay
              roomId={room.roomId}
              className="hover:bg-accent"
              date={room.lastUpdated}
            />
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
