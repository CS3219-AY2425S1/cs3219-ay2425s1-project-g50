import AuthPageWrapper from "@/components/auth/auth-page-wrapper";
import CollabRoom from "@/components/collab/collab-room";
import { Suspense } from "react";

export default function CollabPage({
  params,
}: {
  params: { room_id: string };
}) {
  return (
    <AuthPageWrapper requireLoggedIn>
      <Suspense>
        <CollabRoom roomId={params.room_id} />
      </Suspense>
    </AuthPageWrapper>
  );
}
