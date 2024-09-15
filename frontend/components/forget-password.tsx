'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from 'lucide-react'

const ForgetPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:3001/users/password-reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to request password reset');
      }
  
      const data = await response.json();
      setSuccess(true);
      console.log(data.message);
    } catch (error) {
      console.error('Error requesting password reset:', error);
      setError(error instanceof Error ? error.message : 'Failed to send reset link. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Forget Password</h1>
      <Tabs defaultValue="reset" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="reset">Reset Password</TabsTrigger>
        </TabsList>
        <TabsContent value="reset">
          <Card>
            <CardHeader>
              <CardTitle>Reset Password</CardTitle>
              <CardDescription>Enter your email to receive a password reset link.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">Send Reset Link</Button>
              </form>
              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>Password reset link has been sent to your email.</AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter>
              <Link href="/login" className="text-sm text-blue-600 hover:underline">
                Return to login
              </Link>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ForgetPassword;