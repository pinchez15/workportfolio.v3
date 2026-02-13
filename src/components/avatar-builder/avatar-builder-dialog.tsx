"use client"

import { useState, useCallback, useRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { svgToPng } from "./avatar-utils"
import { AvatarBuilder } from "./avatar-builder"

interface AvatarBuilderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAvatarSaved: (publicUrl: string) => void
  userId: string
}

export function AvatarBuilderDialog({
  open,
  onOpenChange,
  onAvatarSaved,
}: AvatarBuilderDialogProps) {
  const [isSaving, setIsSaving] = useState(false)
  const svgRef = useRef<string>("")

  const handleSvgChange = useCallback((svg: string) => {
    svgRef.current = svg
  }, [])

  const handleSave = async () => {
    if (!svgRef.current) return

    setIsSaving(true)
    try {
      // Convert SVG to PNG
      const blob = await svgToPng(svgRef.current, 400)
      const file = new File([blob], "avatar.png", { type: "image/png" })

      // Upload via API route (uses service role key, bypasses RLS)
      const formData = new FormData()
      formData.append("file", file)

      const uploadRes = await fetch("/api/upload/images", {
        method: "POST",
        body: formData,
      })

      if (!uploadRes.ok) throw new Error("Upload failed")

      const { file: uploaded } = await uploadRes.json()
      const publicUrl = uploaded.url as string

      // Update avatar_url via API route
      const updateRes = await fetch("/api/users/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar_url: publicUrl }),
      })

      if (!updateRes.ok) throw new Error("Failed to update profile")

      onAvatarSaved(publicUrl)
      onOpenChange(false)
    } catch {
      // Error handled by parent via toast
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Your Avatar</DialogTitle>
          <DialogDescription>
            Choose a style and customize your illustrated avatar
          </DialogDescription>
        </DialogHeader>

        <AvatarBuilder onSvgChange={handleSvgChange} />

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
            className="bg-transparent"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isSaving ? "Saving..." : "Save Avatar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
