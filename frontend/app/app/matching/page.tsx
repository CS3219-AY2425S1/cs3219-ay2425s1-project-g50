import AuthPageWrapper from "@/components/auth/auth-page-wrapper";
import FindMatch from "@/components/matching/find-match";
import { Suspense } from "react";

export default function MatchingPage() {
  return (
    <AuthPageWrapper requireLoggedIn>
      <Suspense>
        <FindMatch />
      </Suspense>
    </AuthPageWrapper>
  );
}
