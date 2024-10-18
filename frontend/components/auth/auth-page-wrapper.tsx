"use client";

import React from "react";
import { ReactNode } from "react";
import { useAuth } from "@/app/auth/auth-context";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import LoadingScreen from "../common/loading-screen";

type AuthCheck = (
  user: { id: string; isAdmin: boolean } | undefined | null
) => boolean;

interface AuthPageWrapperProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode;
  userId?: string;

  // User access rules
  authCheck?: AuthCheck; // Custom predicate which is true when user is to be granted access
  requireAdmin?: boolean;
  requireLoggedIn?: boolean;
}

const AuthPageWrapper: React.FC<AuthPageWrapperProps> = ({
  children,
  userId,
  ...props
}) => {
  const auth = useAuth();
  const router = useRouter();

  const authCheck = (
    user: { id: string; isAdmin: boolean } | undefined | null
  ): boolean => {
    if (props?.requireLoggedIn && !user) {
      return false;
    }
    if (props?.requireAdmin && !user?.isAdmin) {
      return false;
    }
    if (userId && user?.id !== userId) {
      return false;
    }
    if (props?.authCheck) {
      return props.authCheck(user);
    }
    // Allow access if no user access rule is defined
    return true;
  };

  return (
    <div>
      {auth?.isLoading ? (
        <LoadingScreen />
      ) : authCheck(auth?.user) ? (
        children
      ) : (
        <div className="flex items-start justify-center h-2/6">
          <div className="text-center mt-[20vh]">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
              Uh Oh! You&apos;re not supposed to be here!
            </h1>
            <Button
              size="lg"
              onClick={() => {
                auth?.user
                  ? router.push("/app/questions")
                  : router.push("/auth/login");
              }}
            >
              Return Home
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthPageWrapper;
