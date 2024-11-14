import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DeleteAccountModalProps {
  showDeleteModal: boolean;
  originalUsername: string;
  confirmUsername: string;
  setConfirmUsername: (username: string) => void;
  handleDeleteAccount: () => void;
  isDeleteButtonEnabled: boolean;
  setShowDeleteModal: (show: boolean) => void;
  isAdmin: boolean;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  showDeleteModal,
  originalUsername,
  confirmUsername,
  setConfirmUsername,
  handleDeleteAccount,
  isDeleteButtonEnabled,
  setShowDeleteModal,
  isAdmin,
}) => {
  return (
    <>
      {showDeleteModal && (
        <Dialog>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Delete Account</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {isAdmin ? (
                <p>
                  To delete, please confirm the username ({originalUsername}):
                </p>
              ) : (
                <p>
                  To confirm, please type your username ({originalUsername}):
                </p>
              )}
              <Input
                type="text"
                placeholder="Confirm username"
                value={confirmUsername}
                onChange={(e) => setConfirmUsername(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteModal(false);
                  setConfirmUsername("");
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setShowDeleteModal(false);
                  setConfirmUsername("");
                  handleDeleteAccount();
                }}
                disabled={!isDeleteButtonEnabled}
              >
                Delete Account
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default DeleteAccountModal;
