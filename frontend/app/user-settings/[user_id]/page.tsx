import { notFound } from 'next/navigation'
import UserSettings from '@/components/user-settings'

export default function UserSettingsPage({ params }: { params: { user_id: string } }) {
  // Here you would typically fetch the user data based on the user_id
  // For demonstration, we're just checking if the user_id is valid
  if (params.user_id !== '12345') {
    notFound()
  }

  return <UserSettings userId={params.user_id} />
}