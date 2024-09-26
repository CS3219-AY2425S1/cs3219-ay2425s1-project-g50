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
import AuthPageWrapper from "@/components/auth/auth-page-wrapper";
import { User, UserArraySchema } from "@/lib/schemas/user-schema";

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
  const { data, isLoading } = useSWR("http://localhost:3001/users", fetcher);

  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (data) {
      setUsers(data);
    }
  }, [data]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  const handleDelete = async (userId: string) => {
    const token = auth?.token;
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`http://localhost:3001/users/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete user");
    }

    setUsers(users.filter((user) => user.id !== userId));
  };

  return (
    <AuthPageWrapper requireAdmin>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">User Management</h1>
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
                  <Button variant="outline" className="mr-2" onClick={() => {}}>
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AuthPageWrapper>
  );
}
