import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteQuestionModalProps {
  showDeleteModal: boolean;
  questionTitle: string;
  handleDeleteQuestion: () => void;
  setShowDeleteModal: (show: boolean) => void;
}

const DeleteQuestionModal: React.FC<DeleteQuestionModalProps> = ({
  showDeleteModal,
  questionTitle,
  handleDeleteQuestion,
  setShowDeleteModal,
}) => {
  return (
    <>
      {showDeleteModal && (
        <Dialog>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Delete Question</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p>
                Are you sure you want to delete the question titled &quot;
                {questionTitle}&quot;?
              </p>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteQuestion}>
                Delete Question
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default DeleteQuestionModal;
