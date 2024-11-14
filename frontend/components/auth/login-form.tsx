"use client";

import Link from "next/link";

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
import { useState } from "react";
import { useAuth } from "@/app/auth/auth-context";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/hooks/use-toast";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const user = await auth?.login(email, password);
      if (user?.isAdmin) {
        router.push("/app/admin-user-management");
      } else if (user) {
        router.push("/app/questions");
      } else {
        toast({
          title: "Error",
          variant: "destructive",
          description: "Login Failed.",
        });
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        let description_text = "";
        switch (err.message) {
          case "Email and/or password is missing.":
            description_text = "Please provide both email and password.";
            break;
          case "Invalid email or password.":
            description_text = "Username or password is incorrect.";
            break;
          case "Internal server error. Please try again later.":
            description_text =
              "There was an issue with the server. Please try again later.";
            break;
          default:
            description_text =
              "An unexpected error occurred. Please try again.";
            break;
        }
        toast({
          title: "Error",
          variant: "destructive",
          description: description_text,
        });
      } else {
        toast({
          title: "Error",
          variant: "destructive",
          description: "An unexpected error occurred. Please try again.",
        });
      }
    }
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
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
              <Link
                href="/auth/forget-password"
                className="ml-auto inline-block text-sm underline"
              >
                Forgot your password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOffIcon size={20} />
                ) : (
                  <EyeIcon size={20} />
                )}
              </button>
            </div>
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
