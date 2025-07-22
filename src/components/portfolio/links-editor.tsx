"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { Plus, ExternalLink, Trash2, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { createClientComponentClient } from "@/lib/supabase"
import { toast } from "sonner"
import { Link as UserLink } from "@/types/database"

interface LinksEditorProps {
  links: UserLink[]
  onUpdate: (updatedLinks: UserLink[]) => void
}

export function LinksEditor({ links, onUpdate }: LinksEditorProps) {
  const { user: clerkUser } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingLink, setEditingLink] = useState<UserLink | null>(null)
  const [formData, setFormData] = useState<Partial<UserLink>>({
    title: "",
    url: "",
    description: "",
    icon: "ExternalLink",
    visible: true,
    show_preview: false
  })

  const supabase = createClientComponentClient()

  const normalizeUrl = (url: string): string => {
    if (!url) return ""
    
    // Remove whitespace
    url = url.trim()
    
    // Add protocol if missing
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url
    }
    
    return url
  }

  const validateUrl = (url: string): boolean => {
    try {
      const normalized = normalizeUrl(url)
      const urlObj = new URL(normalized)
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
    } catch {
      return false
    }
  }

  const handleSave = async () => {
    if (!clerkUser) return

    const normalizedUrl = normalizeUrl(formData.url || "")
    if (!validateUrl(normalizedUrl)) {
      toast.error("Please enter a valid URL")
      return
    }

    setIsLoading(true)
    try {
      const linkData = {
        ...formData,
        url: normalizedUrl,
        user_id: clerkUser.id
      }

      if (editingLink?.id) {
        // Update existing link
        const { error } = await supabase
          .from('links')
          .update(linkData)
          .eq('id', editingLink.id)

        if (error) throw error

        const updatedLinks = links.map(link => 
          link.id === editingLink.id ? { ...link, ...linkData } : link
        )
        onUpdate(updatedLinks)
        toast.success("Link updated successfully!")
      } else {
        // Create new link
        const { data, error } = await supabase
          .from('links')
          .insert(linkData)
          .select()
          .single()

        if (error) throw error

        onUpdate([...links, data])
        toast.success("Link added successfully!")
      }

      setIsDialogOpen(false)
      setEditingLink(null)
      setFormData({
        title: "",
        url: "",
        description: "",
        icon: "ExternalLink",
        visible: true,
        show_preview: false
      })
    } catch {
              // Error saving link
      toast.error("Failed to save link")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (linkId: string) => {
    if (!clerkUser) return

    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('links')
        .delete()
        .eq('id', linkId)

      if (error) throw error

      const updatedLinks = links.filter(link => link.id !== linkId)
      onUpdate(updatedLinks)
      toast.success("Link deleted successfully!")
    } catch (error) {
              // Error deleting link
      toast.error("Failed to delete link")
    } finally {
      setIsLoading(false)
    }
  }

  const openEditDialog = (link?: UserLink) => {
    if (link) {
      setEditingLink(link)
      setFormData(link)
    } else {
      setEditingLink(null)
      setFormData({
        title: "",
        url: "",
        description: "",
        icon: "ExternalLink",
        visible: true,
        show_preview: false
      })
    }
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Links</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openEditDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Link
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingLink ? "Edit Link" : "Add a Link"}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Portfolio Website"
                />
              </div>

              <div>
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  value={formData.url}
                  onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="https://example.com or example.com"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Supports: https://www.website, www.website, website.com, .io, .ai, .ee domains
                </p>
              </div>

              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of this link"
                  rows={2}
                />
              </div>

              <div>
                <Label>Show Preview?</Label>
                <RadioGroup
                  value={formData.show_preview ? "true" : "false"}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, show_preview: value === "true" }))}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="true" id="preview-true" />
                    <Label htmlFor="preview-true" className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      Yes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="false" id="preview-false" />
                    <Label htmlFor="preview-false" className="flex items-center">
                      <EyeOff className="h-4 w-4 mr-1" />
                      No
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isLoading || !formData.title || !formData.url}
                >
                  {isLoading ? "Saving..." : editingLink ? "Update Link" : "Add Link"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Links List */}
      <div className="space-y-3">
        {links.map((link) => (
          <div key={link.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <ExternalLink className="h-4 w-4 text-gray-500" />
                <h4 className="font-medium">{link.title}</h4>
                {link.show_preview && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Preview
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1">{link.url}</p>
              {link.description && (
                <p className="text-sm text-gray-500 mt-1">{link.description}</p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => openEditDialog(link)}
              >
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(link.id!)}
                disabled={isLoading}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        
        {links.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <ExternalLink className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No links added yet. Add your first link to get started!</p>
          </div>
        )}
      </div>
    </div>
  )
} 