import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const difficulties: string[] = ["Easy", "Medium", "Hard"];
const topics: string[] = [
  "Algorithms",
  "Arrays",
  "Brainteaser",
  "Bit Manipulation",
  "Databases",
  "Data Structures",
  "Recursion",
  "Strings",
];

interface MatchFormProps {
  selectedDifficulty: string;
  setSelectedDifficulty: (difficulty: string) => void;
  selectedTopic: string;
  setSelectedTopic: (topic: string) => void;
  handleSearch: () => void;
  isSearching: boolean;
  handleCancel: () => void;
}

export function MatchForm({
  selectedDifficulty,
  setSelectedDifficulty,
  selectedTopic,
  setSelectedTopic,
  handleSearch,
  isSearching,
  handleCancel,
}: MatchFormProps) {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Find a Match</CardTitle>
        <CardDescription>
          Select your preferred difficulty level and topic to find a match.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <Label
              htmlFor="difficulty-select"
              className="text-lg font-medium mb-2 block"
            >
              Difficulty Level
            </Label>
            <Select
              value={selectedDifficulty}
              onValueChange={setSelectedDifficulty}
            >
              <SelectTrigger id="difficulty-select">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                {difficulties.map((difficulty) => (
                  <SelectItem key={difficulty} value={difficulty}>
                    {difficulty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label
              htmlFor="topic-select"
              className="text-lg font-medium mb-2 block"
            >
              Topic
            </Label>
            <Select value={selectedTopic} onValueChange={setSelectedTopic}>
              <SelectTrigger id="topic-select">
                <SelectValue placeholder="Select topic" />
              </SelectTrigger>
              <SelectContent>
                {topics.map((topic) => (
                  <SelectItem key={topic} value={topic}>
                    {topic}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {!isSearching ? (
          <Button onClick={handleSearch}>Find Match</Button>
        ) : (
          <Button variant="destructive" onClick={handleCancel}>
            Cancel Search
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
