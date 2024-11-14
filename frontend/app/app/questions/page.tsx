import AuthPageWrapper from "@/components/auth/auth-page-wrapper";
import QuestionListing from "@/components/questions/questions-listing";
import { Suspense } from "react";

export default function QuestionListingPage() {
  return (
    <AuthPageWrapper requireLoggedIn>
      <Suspense>
        <QuestionListing />
      </Suspense>
    </AuthPageWrapper>
  );
}
