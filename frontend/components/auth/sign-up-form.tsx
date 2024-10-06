"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/hooks/use-toast";
import { signUp } from "@/lib/signup";

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

export function SignUpForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const router = useRouter();

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
    const res = await signUp(username, email, password);
    if (!res.ok) {
      toast({
        title: "Unknown Error",
        description: "An unexpected error has occurred",
      });
    }
    switch (res.status) {
      case 201:
        toast({
          title: "Success",
          description: "Your account has been created!",
        });
        router.push("/auth/login");
        break;
      case 400:
        // In theory, they should never be able to send out a request
        // with missing fields due to disabled submission button
        toast({
          title: "Missing Fields",
          description: "Please fill out all fields",
        });
        break;
      case 409:
        toast({
          title: "Duplicted Username or Email",
          description: "The username or email you entered is already in use",
        });
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
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your details below to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Username</Label>
            </div>
            <Input
              id="password"
              type="text"
              placeholder="mmo123"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
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
            disabled={!username || !email || !password || !passwordConfirmation}
          >
            Sign Up
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/auth/login" className="underline">
            Log in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
