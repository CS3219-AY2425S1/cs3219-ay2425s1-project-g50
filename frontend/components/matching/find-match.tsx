"use client";
import React, { useState, useEffect } from "react";
import { MatchForm } from "@/components/matching/matching-form";
import { SearchProgress } from "@/components/matching/search-progress";
import { SelectionSummary } from "@/components/matching/selection-summary";
import { useToast } from "@/components/hooks/use-toast";
import { useAuth } from "@/app/auth/auth-context";
import { joinMatchQueue } from "@/lib/api/matching-service/join-match-queue";
import { leaveMatchQueue } from "@/lib/api/matching-service/leave-match-queue";
import { subscribeMatch } from "@/lib/api/matching-service/subscribe-match";
import { useRouter } from "next/navigation";

export default function FindMatch() {
  const router = useRouter();
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("");
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [waitTime, setWaitTime] = useState<number>(0);
  const { toast } = useToast();
  const auth = useAuth();

  const waitTimeout = 60000;

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isSearching) {
      interval = setInterval(() => {
        setWaitTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      setWaitTime(0);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isSearching]);

  const handleSearch = async () => {
    if (!selectedDifficulty || !selectedTopic) {
      toast({
        title: "Invalid Selection",
        description: "Please select both a difficulty level and a topic",
        variant: "destructive",
      });
      return;
    }

    if (!auth || !auth.token) {
      toast({
        title: "Access denied",
        description: "No authentication token found",
        variant: "destructive",
      });
      return;
    }

    if (!auth.user) {
      toast({
        title: "Access denied",
        description: "Not logged in",
        variant: "destructive",
      });
      return;
    }

    let isMatched = false;

    const response = await joinMatchQueue(
      auth.token,
      auth?.user?.id,
      selectedTopic,
      selectedDifficulty
    );
    switch (response.status) {
      case 201:
        const initialResponseData = await response.json();
        let responseData;
        if (typeof initialResponseData === "string") {
          try {
            responseData = JSON.parse(initialResponseData);
          } catch (error) {
            toast({
              title: "Error",
              description: "Unexpected error occured, please try again",
              variant: "destructive",
            });
            return;
          }
        } else {
          responseData = initialResponseData;
        }

        if (responseData) {
          isMatched = true;
          const room_id = responseData.room_id;
          toast({
            title: "Matched",
            description: "Successfully matched",
            variant: "success",
          });
          router.push(`/app/collab/${room_id}`);
        } else {
          toast({
            title: "Error",
            description: "Room ID not found",
            variant: "destructive",
          });
        }
        break;

      case 202:
      case 304:
        setIsSearching(true);
        const ws = await subscribeMatch(
          auth?.user.id,
          selectedTopic,
          selectedDifficulty
        );
        const queueTimeout = setTimeout(() => {
          handleCancel(true);
        }, waitTimeout);

        ws.onmessage = async (event) => {
          try {
            let responseData = JSON.parse(event.data);
            if (typeof responseData === "string") {
              responseData = JSON.parse(responseData);
            }

            const user1_id = responseData.user1;
            const user2_id = responseData.user2;
            const room_id = responseData.room_id;
            if (user1_id && user2_id) {
              isMatched = true;
              setIsSearching(false);
              clearTimeout(queueTimeout);
              toast({
                title: "Matched",
                description: "Successfully matched",
                variant: "success",
              });
              router.push(`/app/collab/${room_id}`);
            }
          } catch (error) {
            toast({
              title: "Error",
              description: "Unexpected error occurred, please try again",
              variant: "destructive",
            });
          }
        };

        ws.onclose = () => {
          setIsSearching(false);
          clearTimeout(queueTimeout);
          if (!isMatched) {
            toast({
              title: "Matching Stopped",
              description: "Matching has been stopped",
              variant: "destructive",
            });
          }
        };
        return;
      case 404:
        toast({
          title: "Error",
          description:
            "No question with specified difficulty level and complexity exists!",
          variant: "destructive",
        });
        return;
      default:
        toast({
          title: "Unknown Error",
          description: "An unexpected error has occured",
          variant: "destructive",
        });
        return;
    }
  };

  const handleCancel = async (timedOut: boolean) => {
    if (!selectedDifficulty || !selectedTopic) {
      toast({
        title: "Invalid Selection",
        description: "Please select both a difficulty level and a topic",
        variant: "destructive",
      });
      return;
    }

    if (!auth || !auth.token) {
      toast({
        title: "Access denied",
        description: "No authentication token found",
        variant: "destructive",
      });
      return;
    }

    if (!auth.user) {
      toast({
        title: "Access denied",
        description: "Not logged in",
        variant: "destructive",
      });
      return;
    }

    const response = await leaveMatchQueue(
      auth.token,
      auth.user?.id,
      selectedTopic,
      selectedDifficulty
    );
    switch (response.status) {
      case 200:
        setIsSearching(false);
        setWaitTime(0);
        if (timedOut) {
          toast({
            title: "Timed Out",
            description: "Matching has been stopped",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Matching Stopped",
            description: "Matching has been stopped",
            variant: "destructive",
          });
        }
        return;
      default:
        toast({
          title: "Unknown Error",
          description: "An unexpected error has occured",
          variant: "destructive",
        });
        return;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <MatchForm
        selectedDifficulty={selectedDifficulty}
        setSelectedDifficulty={setSelectedDifficulty}
        selectedTopic={selectedTopic}
        setSelectedTopic={setSelectedTopic}
        handleSearch={handleSearch}
        isSearching={isSearching}
        handleCancel={() => handleCancel(false)}
      />

      {isSearching && <SearchProgress waitTime={waitTime} />}

      {!isSearching && (selectedDifficulty || selectedTopic) && (
        <SelectionSummary
          selectedDifficulty={selectedDifficulty}
          selectedTopic={selectedTopic}
        />
      )}
    </div>
  );
}
