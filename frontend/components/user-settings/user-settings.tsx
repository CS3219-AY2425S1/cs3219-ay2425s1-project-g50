"use client";

import { useEffect, useState, useRef } from "react";
import useSWR from "swr";
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "@/components/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import DeleteAccountModal from "@/components/user-settings/delete-account-modal";
import ProfileTab from "@/components/user-settings/profile-tab";
import LoadingScreen from "@/components/common/loading-screen";
import { useAuth } from "@/app/auth/auth-context";
import { cn } from "@/lib/utils";

interface User {
  username: string;
  email: string;
  skillLevel: string;
}

const fetcher = (url: string) => {
  // Retrieve the JWT token from localStorage
  const token = localStorage.getItem("jwtToken");
  if (!token) {
    throw new Error("No authentication token found");
  }

  return fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  }).then((res) => {
    if (!res.ok) {
      throw new Error("An error occurred while fetching the data.");
    }
    return res.json();
  });
};

export default function UserSettings({ userId }: { userId: string }) {
  const auth = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data, error, isLoading, mutate } = useSWR(
    `http://localhost:3001/users/${userId}`,
    fetcher
  );
  const [user, setUser] = useState<User | null>(null);
  const [originalUsername, setOriginalUsername] = useState<string>("");
  const [profilePicture, setProfilePicture] = useState(
    "/img/placeholder.svg?height=100&width=100"
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmUsername, setConfirmUsername] = useState("");
  const [isDeleteButtonEnabled, setIsDeleteButtonEnabled] = useState(false);

  // Use effect to fetch information related to the currently logged-in user
  useEffect(() => {
    if (data) {
      const { username, email, skillLevel } = data.data;

      setUser({ username, email, skillLevel });
      setOriginalUsername(username);
    }
  }, [data]);

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
      });
    }
  };

  // Function to handle changes in the skill level field
  const handleSkillLevelChange = (value: string) => {
    if (user) {
      setUser({
        ...user,
        skillLevel: value,
      });
    }
  };

  // Function to handle changes in the profile picture, allowing user to select image from his/her own files
  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to delete the current profile picture, defaulting to a default placeholder image
  const handleDeleteProfilePicture = () => {
    setProfilePicture("/img/placeholder.svg?height=100&width=100");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Function to save any updates to the user's information
  const handleSaveChanges = async () => {
    if (user) {
      const token = auth?.token;
      if (!token) {
        console.error("No authentication token found");
        return;
      }

      try {
        const response = await fetch(`http://localhost:3001/users/${userId}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        });
        if (!response.ok) {
          throw new Error("Failed to save changes");
        } else {
          toast({
            title: "Success 💪",
            description: "User information is updated successfully!",
          });
        }

        console.log("Changes saved successfully!");
        mutate();
      } catch (error) {
        console.error("Error saving changes:", error);
        toast({
          title: "Failed ❗",
          description: "An error has occured when saving changes.",
        });
      }
    }
  };

  // Function to handle the deletion of the user account, which is called from the delete account modal
  const handleDeleteAccount = async () => {
    const token = auth?.token;
    if (!token) {
      console.error("No authentication token found");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to delete account");

      console.log("Account deleted successfully!");
      // Redirect to the main page after successful deletion
      window.location.href = "/";
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  // Logic to toggle password visibility
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = (field: string) => {
    switch (field) {
      case "current":
        setShowCurrentPassword(!showCurrentPassword);
        break;
      case "new":
        setShowNewPassword(!showNewPassword);
        break;
      case "confirm":
        setShowConfirmPassword(!showConfirmPassword);
        break;
    }
  };

  // Logic to handle password changes
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  useEffect(() => {
    if (newPassword && confirmPassword) {
      setPasswordsMatch(newPassword === confirmPassword);
    } else {
      setPasswordsMatch(true); // Reset when either field is empty
    }
  }, [newPassword, confirmPassword]);

  const handleChangePassword = async () => {
    // dummy function; does nothing
  };

  // Logic to check if the password is complex enough
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  useEffect(() => {
    if (newPassword) {
      setIsPasswordValid(isPasswordComplex(newPassword));
    } else {
      setIsPasswordValid(true);
    }

    if (newPassword && confirmPassword) {
      setPasswordsMatch(newPassword === confirmPassword);
    } else {
      setPasswordsMatch(true);
    }
  }, [newPassword, confirmPassword]);
  const isPasswordComplex = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(
      password
    );

    return password.length >= minLength && hasUpperCase && hasSpecialChar;
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <div>Error: Failed to load user data</div>;
  }

  if (!user) {
    return <div>No user data available.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        User Settings for {originalUsername}
      </h1>
      <Tabs defaultValue="profile">
        <TabsList className="mb-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <ProfileTab
            user={user}
            profilePicture={profilePicture}
            handleInputChange={handleInputChange}
            handleSkillLevelChange={handleSkillLevelChange}
            handleProfilePictureChange={handleProfilePictureChange}
            handleDeleteProfilePicture={handleDeleteProfilePicture}
            handleSaveChanges={handleSaveChanges}
            fileInputRef={fileInputRef}
          />
        </TabsContent>
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Security</CardTitle>
              <CardDescription>
                Manage your password and account settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    className="pr-10"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute inset-y-0 right-0 h-full px-3 flex items-center"
                    onClick={() => togglePasswordVisibility("current")}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="relative">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    className={cn(
                      "pr-10",
                      !passwordsMatch && "border-destructive"
                    )}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute inset-y-0 right-0 h-full px-3 flex items-center"
                    onClick={() => togglePasswordVisibility("new")}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="relative">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    className={cn(
                      "pr-10",
                      !passwordsMatch && "border-destructive"
                    )}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute inset-y-0 right-0 h-full px-3 flex items-center"
                    onClick={() => togglePasswordVisibility("confirm")}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {!passwordsMatch && (
                  <p className="text-sm text-destructive mt-1">
                    Passwords do not match
                  </p>
                )}
                {!isPasswordValid && newPassword && (
                  <p className="text-sm text-destructive mt-1">
                    Password must be at least 8 characters long, include 1
                    uppercase letter and 1 special character.
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                disabled={
                  !passwordsMatch ||
                  !isPasswordValid ||
                  !newPassword ||
                  !confirmPassword ||
                  !currentPassword
                }
                onClick={handleChangePassword}
              >
                Change Password
              </Button>
            </CardFooter>
          </Card>

          <DeleteAccountModal
            showDeleteModal={showDeleteModal}
            originalUsername={originalUsername}
            confirmUsername={confirmUsername}
            setConfirmUsername={setConfirmUsername}
            handleDeleteAccount={handleDeleteAccount}
            isDeleteButtonEnabled={isDeleteButtonEnabled}
            setShowDeleteModal={setShowDeleteModal}
          />

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Delete Account</CardTitle>
              <CardDescription>
                Permanently delete your account and all associated data.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>
                  This action cannot be undone. All your data will be
                  permanently removed.
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter>
              <Button
                variant="destructive"
                onClick={() => setShowDeleteModal(true)}
              >
                Delete Account
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
