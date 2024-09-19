"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { resetPassword } from "@/lib/reset-password";
import { useToast } from "@/components/hooks/use-toast";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ResetPasswordForm({ token }: { token: string }) {
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // TODO: Add validation for password
    if (password !== passwordConfirmation) {
      toast({
        title: "Password Mismatch",
        description: "The passwords you entered do not match",
      });
      return;
    }
    const res = await resetPassword(token, password);
    if (!res.ok) {
      toast({
        title: "Unknown Error",
        description: "An unexpected error has occurred",
      });
    }
    switch (res.status) {
      case 200:
        toast({
          title: "Success",
          description: "Your password has been reset!",
        });
        setTimeout(() => router.push("/auth/login"), 500);
        break;
      case 500:
        toast({
          title: "Server Error",
          description: "The server encountered an error",
        });
        break;
      default:
        toast({
          title: "Unknown Error",
          description: "An unexpected error has occured",
        });
        break;
    }
  };

  return (
    <Card className="mx-auto w-96 max-w-xl">
      <CardHeader>
        <CardTitle className="text-2xl">Reset Password</CardTitle>
        <CardDescription>Enter your new password below</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="passwordConfirmation">
                Password Confirmation
              </Label>
            </div>
            <Input
              id="passwordConfirmation"
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={!password || !passwordConfirmation}
          >
            Reset Password
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
