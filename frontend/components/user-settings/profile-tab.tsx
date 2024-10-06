"use client";

import React from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/lib/schemas/user-schema";

interface ProfileTabProps {
  user: User;
  profilePicture: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSkillLevelChange: (value: string) => void;
  handleProfilePictureChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDeleteProfilePicture: () => void;
  handleSaveChanges: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

export default function ProfileTab({
  user,
  profilePicture,
  handleInputChange,
  handleSkillLevelChange,
  handleProfilePictureChange,
  handleDeleteProfilePicture,
  handleSaveChanges,
  fileInputRef,
}: ProfileTabProps) {
  return (
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
            <Input
              type="file"
              accept="image/*"
              onChange={handleProfilePictureChange}
              className="mb-2"
              ref={fileInputRef}
            />
            <Button variant="outline" onClick={handleDeleteProfilePicture}>
              Delete Picture
            </Button>
          </div>
        </div>
        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            value={user.username}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={user.email}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="skillLevel">Skill Level</Label>
          <Select
            value={user.skillLevel ?? undefined}
            onValueChange={handleSkillLevelChange}
          >
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
  );
}
