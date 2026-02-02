"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export default function WelcomeDemo() {
  const { user: clerkUser, isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const [userCreated, setUserCreated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    bio: "",
  });

  useEffect(() => {
    // Wait for Clerk to finish loading before checking auth state
    if (!isLoaded) {
      return;
    }

    // Only redirect if explicitly not signed in
    if (isSignedIn === false) {
      router.push('/');
      return;
    }

    // User is signed in - ensure they exist in database
    if (isSignedIn && !userCreated) {
      const ensureUserExists = async () => {
        try {
          const response = await fetch('/api/users/create', {
            method: 'POST',
          });

          if (response.ok) {
            const data = await response.json();
            setUserCreated(true);
            setUsername(data.username || data.user?.username);

            // Pre-populate name from Clerk if available
            if (clerkUser) {
              const fullName = [clerkUser.firstName, clerkUser.lastName]
                .filter(Boolean)
                .join(' ');
              setFormData(prev => ({
                ...prev,
                name: fullName || prev.name,
              }));
            }
          }
        } catch (error) {
          console.error('Error ensuring user exists:', error);
        }
      };

      ensureUserExists();
    }
  }, [isSignedIn, isLoaded, router, userCreated, clerkUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/users/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          title: formData.title.trim() || null,
          bio: formData.bio.trim() || null,
        }),
      });

      if (response.ok) {
        // Redirect to portfolio with flag to open "Add Project" modal
        router.push(`/${username}?addProject=true`);
      } else {
        console.error('Failed to update profile');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setIsSubmitting(false);
    }
  };

  // Show loading state while Clerk is loading or user hasn't been created yet
  if (!isLoaded || (isSignedIn && !userCreated)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50/30">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Setting up your portfolio...</p>
        </div>
      </div>
    );
  }

  // If not signed in after loading, this will redirect (handled in useEffect)
  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50/30 p-4">
      <Card className="max-w-lg w-full shadow-xl border-0">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Welcome to WorkPortfolio!
          </CardTitle>
          <CardDescription className="text-gray-600 text-base">
            Let&apos;s set up your profile. This takes 30 seconds.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700 font-medium">
                Your Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="John Smith"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="h-11"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-700 font-medium">
                Professional Title
              </Label>
              <Input
                id="title"
                placeholder="Product Manager at Acme Inc"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="h-11"
              />
              <p className="text-xs text-gray-500">
                Your role or what you do (e.g., &quot;Senior Developer&quot;, &quot;UX Designer&quot;)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-gray-700 font-medium">
                Short Bio
              </Label>
              <Textarea
                id="bio"
                placeholder="I help companies build products that users love..."
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                className="min-h-[100px] resize-none"
              />
              <p className="text-xs text-gray-500">
                A brief intro about yourself and what you do
              </p>
            </div>

            <Button
              type="submit"
              disabled={!formData.name.trim() || isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 h-12 rounded-xl mt-4"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Creating Portfolio...
                </>
              ) : (
                "Continue to Add Your First Project →"
              )}
            </Button>

            <p className="text-center text-xs text-gray-500 pt-2">
              You can always edit this later from your portfolio
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
