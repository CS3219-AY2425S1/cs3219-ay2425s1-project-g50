import AdminUserManagement from "@/components/admin-user-management/admin-user-management";
import AuthPageWrapper from "@/components/auth/auth-page-wrapper";

export default function AdminUserManagementPage() {
  return (
    <AuthPageWrapper requireAdmin>
      <AdminUserManagement />
    </AuthPageWrapper>
  );
}
