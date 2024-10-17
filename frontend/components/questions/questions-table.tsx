"use client";

import { useState } from "react";
import { Question } from "@/lib/schemas/question-schema";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  TableOfContentsIcon,
  Trash2Icon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "lucide-react";

interface QuestionTableProps {
  data: Question[];
  isAdmin?: boolean;
  handleView: (question: Question) => void;
  handleDelete?: (question: Question) => void;
}

type SortKey = "title" | "category" | "complexity";
type SortOrder = "asc" | "desc";

const QuestionTable: React.FC<QuestionTableProps> = ({ ...props }) => {
  const [sortKey, setSortKey] = useState<SortKey>("title");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const adminActions = (question: Question) => (
    <>
      <Button
        variant="destructive"
        className="ml-2"
        onClick={() => props.handleDelete && props.handleDelete(question)}
      >
        <Trash2Icon className="h-4 w-4" />
      </Button>
    </>
  );

  const sortedData = [...props.data].sort((a, b) => {
    const aValue = a[sortKey].toString().toLowerCase();
    const bValue = b[sortKey].toString().toLowerCase();
    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
    if (columnKey !== sortKey) return null;
    return sortOrder === "asc" ? (
      <ChevronUpIcon className="h-4 w-4 ml-1" />
    ) : (
      <ChevronDownIcon className="h-4 w-4 ml-1" />
    );
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead
            onClick={() => handleSort("title")}
            className="cursor-pointer"
          >
            <div className="flex items-center">
              <span>Title</span>
              <SortIcon columnKey="title" />
            </div>
          </TableHead>
          <TableHead
            onClick={() => handleSort("category")}
            className="cursor-pointer"
          >
            <div className="flex items-center">
              <span>Category</span>
              <SortIcon columnKey="category" />
            </div>
          </TableHead>
          <TableHead
            onClick={() => handleSort("complexity")}
            className="cursor-pointer"
          >
            <div className="flex items-center">
              <span>Complexity</span>
              <SortIcon columnKey="complexity" />
            </div>
          </TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedData.map((question) => (
          <TableRow key={question.id}>
            <TableCell>{question.title}</TableCell>
            <TableCell>{question.category}</TableCell>
            <TableCell>{question.complexity}</TableCell>
            <TableCell>
              <Button
                variant="outline"
                onClick={() => props.handleView(question)}
              >
                <TableOfContentsIcon className="h-4 w-4" />
              </Button>
              {props.isAdmin && adminActions(question)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default QuestionTable;
