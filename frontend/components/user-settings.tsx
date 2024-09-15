'use client'

import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AlertCircle, Moon, Sun } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

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
  const [user, setUser] = useState<{ username: string; email: string, skillLevel: string } | null>(null)
  const [originalUsername, setOriginalUsername] = useState<string>("");
  const [profilePicture, setProfilePicture] = useState('/placeholder.svg?height=100&width=100')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  useEffect(() => {
    if (data) {
      const username = data.data.username
      const email = data.data.email
      const skillLevel = data.data.skillLevel

      setUser({
        username: username,
        email: email,
        skillLevel: skillLevel
      })
      setOriginalUsername(username);
    }
  }, [data])


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (user) {
      setUser({
        ...user,
        [e.target.name]: e.target.value,
      })
    }
  }

  const handleSkillLevelChange = (value: string) => {
    if (user) {
      setUser({
        ...user,
        skillLevel: value,
      })
    }
  }





  //   const handleDarkModeToggle = () => {
  //     if (user) {
  //       mutate({ ...user, darkMode: !user.darkMode }, false)
  //     }
  //     // Here you would typically update the app's theme
  //   }

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

  const handleDeleteProfilePicture = () => {
    setProfilePicture('/placeholder.svg?height=100&width=100')
  }

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
        if (!response.ok) throw new Error('Failed to save changes')

        console.log('Changes saved successfully!')
        mutate()
      } catch (error) {
        console.error('Error saving changes:', error)
        // Handle error (e.g., show an error message to the user)
      }
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

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    switch (id) {
      case 'currentPassword':
        setCurrentPassword(value)
        break
      case 'newPassword':
        setNewPassword(value)
        break
      case 'confirmPassword':
        setConfirmPassword(value)
        break
    }
  }

  const verifyCurrentPassword = async (email: string, password: string) => {
    try {
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        return true; // Password is correct
      } else {
        return false; // Password is incorrect
      }
    } catch (error) {
      console.error('Error verifying password:', error);
      return false;
    }
  };

  /**
 * Handles the change password process.
 *
 * Validates the input fields, verifies the current password, and updates the password if all checks pass.
 *
 * @returns {Promise<void>} - Returns a promise that resolves when the password change process is complete.
 *
 * @example
 * await handleChangePassword();
 */

  const handleChangePassword = async () => {
    // Validate inputs
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('Please fill in all password fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('New password and confirm password do not match');
      return;
    }

    // Verify current password
    const isCurrentPasswordValid = await verifyCurrentPassword(user.email, currentPassword);
    if (!isCurrentPasswordValid) {
      alert('Current password is incorrect');
      return;
    }

    const token = localStorage.getItem('jwtToken');
    if (!token) {
      console.error('No authentication token found');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to change password');
      }

      // Clear password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      alert('Password changed successfully');
    } catch (error) {
      console.error('Error changing password:', error);
      alert(`Failed to change password: ${error.message}`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Settings for {originalUsername}</h1>
      <Tabs defaultValue="profile">
        <TabsList className="mb-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
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
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={handlePasswordInputChange}
                />
              </div>
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={handlePasswordInputChange}
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={handlePasswordInputChange}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleChangePassword}>Change Password</Button>
            </CardFooter>
          </Card>
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
              <Button variant="destructive">Delete Account</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        {/* <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>Customize your app experience.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="darkMode">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Toggle between light and dark themes
                  </p>
                </div>
                <Switch
                  id="darkMode"
                  checked={user.darkMode}
                  onCheckedChange={handleDarkModeToggle}
                />
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex items-center space-x-2">
                {user.darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                <span>Current theme: {user.darkMode ? 'Dark' : 'Light'}</span>
              </div>
            </CardFooter>
          </Card>
        </TabsContent> */}
      </Tabs>
    </div>
  )
}