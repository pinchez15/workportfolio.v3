"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import Image from "next/image"
import { Camera, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { User } from "@/types/database"
import { AvatarBuilderDialog } from "@/components/avatar-builder/avatar-builder-dialog"

interface HeaderEditorProps {
  user: User
  onUpdate: (updatedUser: User) => void
}

export function HeaderEditor({ user, onUpdate }: HeaderEditorProps) {
  const { user: clerkUser } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const [isAvatarBuilderOpen, setIsAvatarBuilderOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: user.name || "",
    title: user.title || "",
    bio: user.bio || "",
    avatar_url: user.avatar_url || "",
    calendly_url: user.calendly_url || ""
  })

  const supabase = createClient()

  const handleAvatarUpload = async (file: File) => {
    if (!clerkUser) return

    setIsLoading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${clerkUser.id}-${Date.now()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('user_uploads')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('user_uploads')
        .getPublicUrl(filePath)

      setFormData(prev => ({ ...prev, avatar_url: publicUrl }))
      
      // Update database
      const { error: updateError } = await supabase
        .from('users')
        .update({ avatar_url: publicUrl })
        .eq('id', clerkUser.id)

      if (updateError) throw updateError

      onUpdate({ ...user, avatar_url: publicUrl })
      toast.success("Avatar updated successfully!")
    } catch {
              // Error uploading avatar
      toast.error("Failed to upload avatar")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!clerkUser) return

    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('users')
        .update({
          name: formData.name,
          title: formData.title,
          bio: formData.bio,
          calendly_url: formData.calendly_url
        })
        .eq('id', clerkUser.id)

      if (error) throw error

      onUpdate({ ...user, ...formData })
      toast.success("Profile updated successfully!")
    } catch {
              // Error updating profile
      toast.error("Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Header Information</h3>
        
        {/* Avatar Section */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100">
              <Image
                src={formData.avatar_url || clerkUser?.imageUrl || "https://via.placeholder.com/80x80/f3f4f6/9ca3af?text=Avatar"}
                alt="Avatar"
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
            <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full cursor-pointer hover:bg-blue-700">
              <Camera className="h-3 w-3" />
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleAvatarUpload(file)
                }}
              />
            </label>
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-2">
              {clerkUser?.imageUrl ?
                "Your avatar is imported from LinkedIn. Upload a higher quality image for better results." :
                "Upload a professional photo or create an illustrated avatar."
              }
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAvatarBuilderOpen(true)}
              className="text-xs bg-transparent"
            >
              <Palette className="h-3 w-3 mr-1" />
              Create Avatar
            </Button>
          </div>
        </div>

        <AvatarBuilderDialog
          open={isAvatarBuilderOpen}
          onOpenChange={setIsAvatarBuilderOpen}
          userId={clerkUser?.id || ""}
          onAvatarSaved={(publicUrl) => {
            setFormData((prev) => ({ ...prev, avatar_url: publicUrl }))
            onUpdate({ ...user, avatar_url: publicUrl })
            toast.success("Avatar updated successfully!")
          }}
        />

        {/* Form Fields */}
        <div className="grid gap-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Your full name"
            />
          </div>

          <div>
            <Label htmlFor="title">Headline</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Senior Web Designer"
            />
          </div>

          <div>
            <Label htmlFor="bio">Description</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Tell visitors about yourself and your expertise..."
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="calendly_url">Calendly Booking Link (Optional)</Label>
            <Input
              id="calendly_url"
              value={formData.calendly_url}
              onChange={(e) => setFormData(prev => ({ ...prev, calendly_url: e.target.value }))}
              placeholder="https://calendly.com/yourusername/meeting-type"
            />
            <p className="text-xs text-gray-500 mt-1">
              Add your Calendly link to let visitors book meetings with you
            </p>
          </div>
        </div>

        <Button 
          onClick={handleSave} 
          disabled={isLoading}
          className="mt-4"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  )
} 