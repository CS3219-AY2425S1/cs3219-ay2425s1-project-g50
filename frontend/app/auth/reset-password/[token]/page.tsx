import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export default function UserSettingsPage({
  params,
}: {
  params: { token: string };
}) {
  return <ResetPasswordForm token={params.token} />;
}
