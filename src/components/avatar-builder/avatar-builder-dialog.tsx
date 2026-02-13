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
import { createClient } from "@/lib/supabase/client"
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
  userId,
}: AvatarBuilderDialogProps) {
  const [isSaving, setIsSaving] = useState(false)
  const svgRef = useRef<string>("")

  const handleSvgChange = useCallback((svg: string) => {
    svgRef.current = svg
  }, [])

  const handleSave = async () => {
    if (!svgRef.current || !userId) return

    setIsSaving(true)
    try {
      const blob = await svgToPng(svgRef.current, 400)
      const file = new File([blob], "avatar.png", { type: "image/png" })

      const supabase = createClient()
      const fileName = `${userId}-${Date.now()}.png`
      const filePath = `avatars/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from("user_uploads")
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage.from("user_uploads").getPublicUrl(filePath)

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
