"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface QuestionFilterProps {
  category: string;
  onCategoryChange: (search: string) => void;
  complexity: string;
  onComplexityChange: (complexity: string) => void;
  search: string;
  onSearchChange: (search: string) => void;
  onReset: () => void;
}

const QuestionFilter: React.FC<QuestionFilterProps> = ({
  category,
  onCategoryChange,
  complexity,
  onComplexityChange,
  search,
  onSearchChange,
  onReset,
}) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Filter Questions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search questions"
              className="mt-1"
              autoFocus
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={category}
              onChange={(e) => onCategoryChange(e.target.value)}
              placeholder="Enter category"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="complexity">Complexity</Label>
            <Select
              value={complexity}
              onValueChange={(value) => onComplexityChange(value)}
            >
              <SelectTrigger id="complexity" className="mt-1">
                <SelectValue placeholder="Select complexity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={onReset} variant="outline" className="mt-4">
          Reset Filters
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuestionFilter;
