import AuthPageWrapper from "@/components/auth/auth-page-wrapper";
import UserRooms from "@/components/collab/user-rooms";
import { Suspense } from "react";

export default function CollabPage() {
  return (
    <AuthPageWrapper requireLoggedIn>
      <Suspense>
        <UserRooms />
      </Suspense>
    </AuthPageWrapper>
  );
}
