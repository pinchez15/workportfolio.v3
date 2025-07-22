"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import Image from "next/image"
import { Plus, Trash2, Upload, Calendar, Building, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Project } from "@/types/database"

interface ProjectsEditorProps {
  projects: Project[]
  onUpdate: (updatedProjects: Project[]) => void
}

export function ProjectsEditor({ projects, onUpdate }: ProjectsEditorProps) {
  const { user: clerkUser } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [formData, setFormData] = useState<Partial<Project>>({
    title: "",
    company: "",
    short_description: "",
    long_description: "",
    start_date: "",
    end_date: "",
    image_paths: [],
    tags: [],
    skills: [],
    visible: true
  })
  const [uploadedImages, setUploadedImages] = useState<string[]>([])

  const supabase = createClient()

  const handleImageUpload = async (files: FileList) => {
    if (!clerkUser) return

    const fileArray = Array.from(files)
    if (fileArray.length + uploadedImages.length > 4) {
      toast.error("Maximum 4 images allowed")
      return
    }

    setIsLoading(true)
    try {
      const uploadPromises = fileArray.map(async (file) => {
        const fileExt = file.name.split('.').pop()
        const fileName = `${clerkUser.id}-${Date.now()}-${Math.random()}.${fileExt}`
        const filePath = `projects/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('user_uploads')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('user_uploads')
          .getPublicUrl(filePath)

        return publicUrl
      })

      const newImageUrls = await Promise.all(uploadPromises)
      const allImages = [...uploadedImages, ...newImageUrls]
      setUploadedImages(allImages)
      setFormData(prev => ({ ...prev, image_paths: allImages }))
      
      toast.success(`${fileArray.length} image(s) uploaded successfully!`)
    } catch {
              // Error uploading images
      toast.error("Failed to upload images")
    } finally {
      setIsLoading(false)
    }
  }

  const removeImage = (index: number) => {
    const newImages = uploadedImages.filter((_, i) => i !== index)
    setUploadedImages(newImages)
    setFormData(prev => ({ ...prev, image_paths: newImages }))
  }

  const handleSave = async () => {
    if (!clerkUser) return

    if (!formData.title) {
      toast.error("Project title is required")
      return
    }

    setIsLoading(true)
    try {
      const projectData = {
        ...formData,
        user_id: clerkUser.id,
        image_path: uploadedImages[0] || null, // Keep first image as main image
        image_paths: uploadedImages
      }

      if (editingProject?.id) {
        // Update existing project
        const { error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', editingProject.id)

        if (error) throw error

        const updatedProjects = projects.map(project => 
          project.id === editingProject.id ? { ...project, ...projectData } : project
        )
        onUpdate(updatedProjects)
        toast.success("Project updated successfully!")
      } else {
        // Create new project
        const { data, error } = await supabase
          .from('projects')
          .insert(projectData)
          .select()
          .single()

        if (error) throw error

        onUpdate([...projects, data])
        toast.success("Project added successfully!")
      }

      setIsDialogOpen(false)
      setEditingProject(null)
      setFormData({
        title: "",
        company: "",
        short_description: "",
        long_description: "",
        start_date: "",
        end_date: "",
        image_paths: [],
        tags: [],
        skills: [],
        visible: true
      })
      setUploadedImages([])
    } catch {
              // Error saving project
      toast.error("Failed to save project")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (projectId: string) => {
    if (!clerkUser) return

    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)

      if (error) throw error

      const updatedProjects = projects.filter(project => project.id !== projectId)
      onUpdate(updatedProjects)
      toast.success("Project deleted successfully!")
    } catch {
              // Error deleting project
      toast.error("Failed to delete project")
    } finally {
      setIsLoading(false)
    }
  }

  const openEditDialog = (project?: Project) => {
    if (project) {
      setEditingProject(project)
      setFormData(project)
      setUploadedImages(project.image_paths || [])
    } else {
      setEditingProject(null)
      setFormData({
        title: "",
        company: "",
        short_description: "",
        long_description: "",
        start_date: "",
        end_date: "",
        image_paths: [],
        tags: [],
        skills: [],
        visible: true
      })
      setUploadedImages([])
    }
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Projects</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openEditDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                {editingProject ? "Edit Project" : "Add a Project"}
                <span className="ml-2 text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center">
                  ⚡ Takes 2 min
                </span>
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Project Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="E-commerce Redesign"
                />
              </div>

              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  placeholder="Company name"
                />
              </div>

              <div>
                <Label htmlFor="short_description">What you achieved</Label>
                <Textarea
                  id="short_description"
                  value={formData.short_description}
                  onChange={(e) => setFormData(prev => ({ ...prev, short_description: e.target.value }))}
                  placeholder="Increased conversion by 34%..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="long_description">Long Description</Label>
                <Textarea
                  id="long_description"
                  value={formData.long_description}
                  onChange={(e) => setFormData(prev => ({ ...prev, long_description: e.target.value }))}
                  placeholder="Detailed description of the project..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="month"
                    value={formData.start_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    type="month"
                    value={formData.end_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label>Screenshot or Demo</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600 mb-2">Drag & Drop</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Button variant="outline" size="sm">
                      Choose Files
                    </Button>
                  </label>
                  <p className="text-xs text-gray-500 mt-2">Up to 4 images (max 5MB each)</p>
                </div>

                {/* Image Preview */}
                {uploadedImages.length > 0 && (
                  <div className="mt-4">
                    <Label>Uploaded Images ({uploadedImages.length}/4)</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {uploadedImages.map((image, index) => (
                        <div key={index} className="relative">
                          <Image
                            src={image}
                            alt={`Project image ${index + 1}`}
                            width={200}
                            height={150}
                            className="w-full h-32 object-cover rounded"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-1 right-1 h-6 w-6 p-0"
                            onClick={() => removeImage(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
                  disabled={isLoading || !formData.title}
                >
                  {isLoading ? "Saving..." : editingProject ? "Update Project" : "Publish Project ✨"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {projects.map((project) => (
          <div key={project.id} className="border rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium">{project.title}</h4>
                {project.company && (
                  <p className="text-sm text-gray-600 flex items-center mt-1">
                    <Building className="h-3 w-3 mr-1" />
                    {project.company}
                  </p>
                )}
                {project.start_date && (
                  <p className="text-sm text-gray-600 flex items-center mt-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    {project.start_date} - {project.end_date || "Present"}
                  </p>
                )}
                {project.short_description && (
                  <p className="text-sm text-gray-600 mt-2">{project.short_description}</p>
                )}
                {project.image_paths && project.image_paths.length > 0 && (
                  <div className="mt-2">
                    <Image
                      src={project.image_paths[0]}
                      alt={project.title}
                      width={100}
                      height={75}
                      className="w-20 h-15 object-cover rounded"
                    />
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditDialog(project)}
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(project.id!)}
                  disabled={isLoading}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
        
        {projects.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Plus className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No projects added yet. Add your first project to showcase your work!</p>
          </div>
        )}
      </div>
    </div>
  )
} 