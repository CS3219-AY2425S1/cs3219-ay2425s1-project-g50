'use client'

import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { useToast } from '@/components/hooks/use-toast'
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import DeleteAccountModal from "@/components/delete-account-modal"

const fetcher = (url: string) => {
  // Retrieve the JWT token from localStorage
  const token = localStorage.getItem('jwtToken')
  if (!token) {
    throw new Error('No authentication token found')
  }

  return fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }).then((res) => {
    if (!res.ok) {
      throw new Error('An error occurred while fetching the data.')
    }
    return res.json()
  })
}

export default function UserSettings({ userId }: { userId: string }) {
    const { data, error, isLoading, mutate } = useSWR(`http://localhost:3001/users/${userId}`, fetcher)
    const [user, setUser] = useState<{ username: string; email: string, skillLevel: string , isDarkMode: boolean } | null>(null)
    const [originalUsername, setOriginalUsername] = useState<string>("")
    const [profilePicture, setProfilePicture] = useState('/img/placeholder.svg?height=100&width=100')
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [confirmUsername, setConfirmUsername] = useState('')
    const [isDeleteButtonEnabled, setIsDeleteButtonEnabled] = useState(false)
    const { toast } = useToast()


    // Use effect to fetch information related to the currently logged-in user
    useEffect(() => {
        if (data) {
            const username = data.data.username
            const email = data.data.email
            const skillLevel = data.data.skillLevel
            const isDarkMode = data.data.isDarkMode

            setUser({
                username: username,
                email: email,
                skillLevel: skillLevel,
                isDarkMode: isDarkMode
            })
            setOriginalUsername(username);
        }
    }, [data])

     // Enable delete button in the delete account modal only when the input username matches the original username
    useEffect(() => {
        setIsDeleteButtonEnabled(confirmUsername === originalUsername);
    }, [confirmUsername, originalUsername]);


    // Function to handle changes in the username/email fields
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (user) {
            setUser({
            ...user,
            [e.target.name]: e.target.value,
            })
        }
    }

    // Function to handle changes in the skill level field
    const handleSkillLevelChange = (value: string) => {
        if (user) {
            setUser({
                ...user,
                skillLevel: value,
            })
        }
    }

    // Function to handle changes in the profile picture, allowing user to select image from his/her own files
    const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
        const reader = new FileReader()
        reader.onloadend = () => {
            setProfilePicture(reader.result as string)
        }
        reader.readAsDataURL(file)
        }
    }

    // Function to delete the current profile picture, defaulting to a default placeholder image
    const handleDeleteProfilePicture = () => {
        setProfilePicture('/img/placeholder.svg?height=100&width=100')
    }

    // Function to save any updates to the user's information
    const handleSaveChanges = async () => {
        if (user) {
        const token = localStorage.getItem('jwtToken')
        if (!token) {
            console.error('No authentication token found')
            return
        }

        try {
            const response = await fetch(`http://localhost:3001/users/${userId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
            })
            if (!response.ok) {
                throw new Error('Failed to save changes')
            } else {
                toast({
                    title: "Success 💪",
                    description: "User information is updated successfully!",
                })
            }

            console.log('Changes saved successfully!')
            mutate()
        } catch (error) {
            console.error('Error saving changes:', error)
            toast({
                title: "Failed ❗",
                description: "An error has occured when saving changes.",
            })
        }
        }
    }


    // Function to handle the deletion of the user account, which is called from the delete account modal
    const handleDeleteAccount = async () => {
        const token = localStorage.getItem('jwtToken')
        if (!token) {
            console.error('No authentication token found')
            return
        }

        try {
            const response = await fetch(`http://localhost:3001/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            })
            if (!response.ok) throw new Error('Failed to delete account')

            console.log('Account deleted successfully!')
            // Redirect to the main page after successful deletion
            window.location.href = '/';
        } catch (error) {
            console.error('Error deleting account:', error)
        }
    }

    if (isLoading) {
        return <div>Loading user data...</div>
    }

    if (error) {
        return <div>Error: Failed to load user data</div>
    }

    if (!user) {
        return <div>No user data available.</div>
    }

    return (
        <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">User Settings for {originalUsername}</h1>
        <Tabs defaultValue="profile">
            <TabsList className="mb-4">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="account">Account</TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
            <Card>
                <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your profile details here.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4">
                        <Avatar className="w-24 h-24">
                        <AvatarImage src={profilePicture} alt="Profile picture" />
                        <AvatarFallback>Placeholder</AvatarFallback>
                        </Avatar>
                        <div>
                        <Input type="file" accept="image/*" onChange={handleProfilePictureChange} className="mb-2" />
                        <Button variant="outline" onClick={handleDeleteProfilePicture}>Delete Picture</Button>
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="username">Username</Label>
                        <Input id="username" name="username" value={user.username} onChange={handleInputChange} />
                    </div>
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" value={user.email} onChange={handleInputChange} />
                    </div>
                    <div>
                        <Label htmlFor="skillLevel">Skill Level</Label>
                        <Select value={user.skillLevel} onValueChange={handleSkillLevelChange}>
                        <SelectTrigger id="skillLevel">
                            <SelectValue placeholder="Select skill level" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Novice">Novice</SelectItem>
                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                            <SelectItem value="Expert">Expert</SelectItem>
                        </SelectContent>
                        </Select>
                    </div>
                </CardContent>
                <CardFooter>
                <Button onClick={handleSaveChanges}>Save Changes</Button>
                <Toaster />
                </CardFooter>
            </Card>
            </TabsContent>
            <TabsContent value="account">
            <Card>
                <CardHeader>
                <CardTitle>Account Security</CardTitle>
                <CardDescription>Manage your password and account settings.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" />
                </div>
                <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" />
                </div>
                <div>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" />
                </div>
                </CardContent>
                <CardFooter>
                <Button>Change Password</Button>
                </CardFooter>
            </Card>

            <DeleteAccountModal
                showDeleteModal={showDeleteModal}
                confirmUsername={confirmUsername}
                setConfirmUsername={setConfirmUsername}
                handleDeleteAccount={handleDeleteAccount}
                isDeleteButtonEnabled={isDeleteButtonEnabled}
                setShowDeleteModal={setShowDeleteModal}
            />

            <Card className="mt-4">
                <CardHeader>
                <CardTitle>Delete Account</CardTitle>
                <CardDescription>Permanently delete your account and all associated data.</CardDescription>
                </CardHeader>
                <CardContent>
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Warning</AlertTitle>
                    <AlertDescription>
                    This action cannot be undone. All your data will be permanently removed.
                    </AlertDescription>
                </Alert>
                </CardContent>
                <CardFooter>
                <Button variant="destructive" onClick={() => setShowDeleteModal(true)}>Delete Account</Button>
                </CardFooter>
            </Card>
            </TabsContent>
        </Tabs>
        </div>
    )
}