import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export default function UserSettingsPage({
  params,
}: {
  params: { token: string };
}) {
  return (
    <div className="flex items-center justify-center h-[90vh]">
      <ResetPasswordForm token={params.token} />
    </div>
  );
}
