import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock } from "lucide-react";

interface SearchProgressProps {
  waitTime: number;
}

export function SearchProgress({ waitTime }: SearchProgressProps) {
  return (
    <Card className="w-full max-w-2xl mx-auto mt-4">
      <CardHeader>
        <CardTitle>Searching for Match</CardTitle>
        <CardDescription>
          Please wait while we find a suitable match for you.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Progress className="w-full" indeterminate />
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>
                Wait Time: {Math.floor(waitTime / 60)}:
                {(waitTime % 60).toString().padStart(2, "0")}
              </span>
            </div>
            <span>Searching...</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
