"use client";

import {
  CategoryEnum,
  CategoryEnumArray,
  ComplexityEnum,
  ComplexityEnumArray,
  Question,
} from "@/lib/schemas/question-schema";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { MultiSelect } from "@/components/ui/multi-select";

interface QuestionFormModalProps {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
  initialData?: Question;
  isAdmin: boolean | undefined;
  handleSubmit: (question: Question) => void;
  submitButtonText: string;
}

const QuestionFormModal: React.FC<QuestionFormModalProps> = ({ ...props }) => {
  const initialQuestionState: Question = {
    id: "",
    title: "",
    categories: [],
    complexity: "Easy",
    description: "",
  };

  const [question, setQuestion] = useState<Question>(
    props.initialData || initialQuestionState
  );

  useEffect(() => {
    if (props.initialData) {
      setQuestion(props.initialData);
    }
  }, [props.initialData]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    props.handleSubmit(question);
    if (props.initialData) {
      setQuestion(props.initialData);
    } else {
      setQuestion(initialQuestionState);
    }
  };

  const handleExit = () => {
    if (props.initialData) {
      setQuestion(props.initialData);
    } else {
      setQuestion(initialQuestionState);
    }
    props.setShowModal(false);
  };

  return (
    <div>
      {props.showModal && (
        <Dialog>
          <form onSubmit={onSubmit}>
            <DialogContent className="overflow-y-scroll max-h-[80vh]">
              <DialogHeader>
                <Label>Title</Label>
                <Input
                  id="title"
                  value={question.title}
                  className="mt-2"
                  onChange={(e) =>
                    setQuestion({ ...question, title: e.target.value })
                  }
                  disabled={!props.isAdmin}
                  required
                />
              </DialogHeader>
              <div>
                <Label>Category</Label>
                {props.isAdmin ? (
                  <MultiSelect
                    className="mt-2"
                    defaultValue={question.categories as string[]}
                    options={CategoryEnumArray.map((category) => ({
                      label: category,
                      value: category,
                    }))}
                    onValueChange={(v) =>
                      setQuestion({
                        ...question,
                        categories: v as CategoryEnum[],
                      })
                    }
                  />
                ) : (
                  <Input
                    className="mt-2"
                    value={question.categories.join(", ")}
                    disabled
                  />
                )}
              </div>

              <div>
                <Label>Complexity</Label>
                <div className="mt-2">
                  {props.isAdmin ? (
                    <Select
                      value={question.complexity}
                      onValueChange={(e: ComplexityEnum) =>
                        setQuestion({ ...question, complexity: e })
                      }
                      disabled={!props.isAdmin}
                    >
                      <SelectTrigger id="complexity">
                        <SelectValue placeholder="Select complexity" />
                      </SelectTrigger>
                      <SelectContent>
                        {ComplexityEnumArray.map((complexity) => (
                          <SelectItem key={complexity} value={complexity}>
                            {complexity}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id="complexity"
                      value={question.complexity}
                      disabled
                    />
                  )}
                </div>
              </div>

              <div>
                <Label>Description</Label>
                <AutosizeTextarea
                  id="description"
                  value={question.description}
                  className="mt-2"
                  minHeight={200}
                  onChange={(e) =>
                    setQuestion({ ...question, description: e.target.value })
                  }
                  disabled={!props.isAdmin}
                  required
                />
              </div>
              <DialogFooter>
                {props.isAdmin && (
                  <Button type="submit">{props.submitButtonText}</Button>
                )}
                <Button variant="destructive" onClick={handleExit}>
                  Exit
                </Button>
              </DialogFooter>
            </DialogContent>
          </form>
        </Dialog>
      )}
    </div>
  );
};

export default QuestionFormModal;
