import UserSettings from '@/components/user-settings'

export default function UserSettingsPage({ params }: { params: { user_id: string } }) {
  return <UserSettings userId={params.user_id} />
}