"use client";

import { useAuth } from "@/app/auth/auth-context";
import { useState, useEffect } from "react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import LoadingScreen from "@/components/common/loading-screen";
import AdminEditUserModal from "@/components/admin-user-management/admin-edit-user-modal";
import DeleteAccountModal from "@/components/common/delete-account-modal";
import { PencilIcon, Trash2Icon } from "lucide-react";
import { User, UserArraySchema } from "@/lib/schemas/user-schema";
import { AuthType, userServiceUri } from "@/lib/api/api-uri";

const fetcher = async (url: string): Promise<User[]> => {
  const token = localStorage.getItem("jwtToken");
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(String(response.status));
  }

  const data = await response.json();

  return UserArraySchema.parse(data.data);
};

export default function AdminUserManagement() {
  const auth = useAuth();

  const { data, isLoading, mutate } = useSWR(
    `${userServiceUri(window.location.hostname, AuthType.Public)}/users`,
    fetcher
  );

  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User>();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmUsername, setConfirmUsername] = useState("");
  const [isDeleteButtonEnabled, setIsDeleteButtonEnabled] = useState(false);

  useEffect(() => {
    if (data) {
      setUsers(data);
    }
  }, [data]);

  // Enable delete button in the delete account modal only when the input username matches the original username
  useEffect(() => {
    setIsDeleteButtonEnabled(confirmUsername === selectedUser?.username);
  }, [confirmUsername, selectedUser]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  const handleDelete = async () => {
    const token = auth?.token;
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(
      `${userServiceUri(window.location.hostname, AuthType.Public)}/users/${selectedUser?.id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete user");
    }

    setUsers(users.filter((user) => user.id !== selectedUser?.id));
  };

  const onUserUpdate = () => {
    mutate();
    setSelectedUser(undefined);
  };

  return (
    <>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">User Management</h1>
        <AdminEditUserModal
          showModal={showModal}
          setShowModal={setShowModal}
          user={selectedUser}
          onUserUpdate={onUserUpdate}
        />
        <DeleteAccountModal
          showDeleteModal={showDeleteModal}
          originalUsername={selectedUser?.username || ""}
          confirmUsername={confirmUsername}
          setConfirmUsername={setConfirmUsername}
          handleDeleteAccount={handleDelete}
          isDeleteButtonEnabled={isDeleteButtonEnabled}
          setShowDeleteModal={setShowDeleteModal}
          isAdmin={true}
        />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Skill Level</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.isAdmin ? "Admin" : "User"}</TableCell>
                <TableCell>{user.skillLevel}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    className="mr-2"
                    onClick={() => {
                      setSelectedUser(user);
                      setShowModal(true);
                    }}
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setSelectedUser(user);
                      setShowDeleteModal(true);
                    }}
                  >
                    <Trash2Icon className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
