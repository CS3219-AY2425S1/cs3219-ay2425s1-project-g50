import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from './ui/button';
import { Input } from './ui/input';

interface DeleteAccountModalProps {
    showDeleteModal: boolean;
    confirmUsername: string;
    setConfirmUsername: (username: string) => void;
    handleDeleteAccount: () => void;
    isDeleteButtonEnabled: boolean;
    setShowDeleteModal: (show: boolean) => void;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
    showDeleteModal,
    confirmUsername,
    setConfirmUsername,
    handleDeleteAccount,
    isDeleteButtonEnabled,
    setShowDeleteModal
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
                            <p>To confirm, please type your username:</p>
                            <Input 
                                type="text" 
                                placeholder="Enter your username" 
                                value={confirmUsername} 
                                onChange={(e) => setConfirmUsername(e.target.value)} 
                            />
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                            <Button 
                                variant="destructive" 
                                onClick={handleDeleteAccount} 
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