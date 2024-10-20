import AuthPageWrapper from "@/components/auth/auth-page-wrapper";
import UserSettings from "@/components/user-settings/user-settings";

export default function UserSettingsPage({
  params,
}: {
  params: { user_id: string };
}) {
  return (
    <AuthPageWrapper requireLoggedIn userId={params.user_id}>
      <UserSettings userId={params.user_id} />
    </AuthPageWrapper>
  );
}
