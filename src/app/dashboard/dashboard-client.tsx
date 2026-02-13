"use client"

import Link from "next/link"
import { useState, useEffect } from "react"


import { UserButton } from "@clerk/nextjs"
import {
  Plus,
  Edit,
  Eye,
  Upload,
  FileImage,
  X,
  GripVertical,
  Compass,
  FolderOpen,
  Link2,
  Lightbulb,
  CalendarDays,
  Palette,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { User, Project, Link as DatabaseLink } from "@/types/database"
import { getSkillSuggestions } from "@/lib/skills"
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd"
import { AvatarBuilderDialog } from "@/components/avatar-builder/avatar-builder-dialog"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface DashboardClientProps {
  user: User
  projects: Project[]
  links: DatabaseLink[]
  skills: string[]
  completeness: {
    percentage: number
    missingFields: string[]
  }
}

export function DashboardClient({
  user,
  projects,
  links,
  skills,
  completeness,
}: DashboardClientProps) {
  // Avatar builder state
  const [isAvatarBuilderOpen, setIsAvatarBuilderOpen] = useState(false)
  const [localUser, setLocalUser] = useState(user)

  // Add Project dialog state
  const [isAddingProject, setIsAddingProject] = useState(false)
  const [projectForm, setProjectForm] = useState({
    title: "",
    company: "",
    short_description: "",
    long_description: "",
    start_date: "",
    end_date: "",
    url: "",
    skills: [] as string[],
    visible: true,
    featured: false,
  })
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Skills search
  const [skillsInput, setSkillsInput] = useState("")
  const [skillSuggestions, setSkillSuggestions] = useState<string[]>([])
  const [showSkillSuggestions, setShowSkillSuggestions] = useState(false)

  // Local projects list (for optimistic updates)
  const [localProjects, setLocalProjects] = useState<Project[]>(projects)

  useEffect(() => {
    setLocalProjects(projects)
  }, [projects])

  const recentProjects = localProjects.slice(0, 5)
  const visibleProjectCount = localProjects.filter((p) => p.visible).length

  const memberSince = new Date(user.created_at).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  })

  // --- Add Project logic (mirrors portfolio-client.tsx) ---

  const openAddProject = () => {
    setProjectForm({
      title: "",
      company: "",
      short_description: "",
      long_description: "",
      start_date: "",
      end_date: "",
      url: "",
      skills: [],
      visible: true,
      featured: false,
    })
    setUploadedFiles([])
    setIsAddingProject(true)
  }

  const closeProjectModal = () => {
    setIsAddingProject(false)
    setUploadedFiles([])
  }

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return
    const validFiles = Array.from(files).filter((file) => {
      const validTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
        "application/pdf",
      ]
      const maxSize = 10 * 1024 * 1024
      if (!validTypes.includes(file.type)) {
        alert(`File type not supported: ${file.type}`)
        return false
      }
      if (file.size > maxSize) {
        alert(
          `File too large: ${file.name} (${(file.size / 1024 / 1024).toFixed(1)} MB). Max size is 10MB.`
        )
        return false
      }
      return true
    })
    setUploadedFiles((prev) => [...prev, ...validFiles].slice(0, 5))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSkillsInputChange = (value: string) => {
    setSkillsInput(value)
    if (value.trim()) {
      setSkillSuggestions(getSkillSuggestions(value))
      setShowSkillSuggestions(true)
    } else {
      setShowSkillSuggestions(false)
    }
  }

  const addSkill = (skill: string) => {
    if (!projectForm.skills.includes(skill)) {
      setProjectForm((prev) => ({
        ...prev,
        skills: [...prev.skills, skill],
      }))
    }
    setSkillsInput("")
    setShowSkillSuggestions(false)
  }

  const removeSkill = (skillToRemove: string) => {
    setProjectForm((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }))
  }

  const handleImageDragEnd = (result: DropResult) => {
    if (!result.destination) return
    const items = Array.from(uploadedFiles)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)
    setUploadedFiles(items)
  }

  const saveProject = async () => {
    if (!projectForm.title.trim()) return
    setIsSaving(true)

    try {
      let imagePaths: string[] = []

      if (uploadedFiles.length > 0) {
        const uploadPromises = uploadedFiles.map(async (file) => {
          const formData = new FormData()
          formData.append("file", file)
          try {
            const res = await fetch("/api/upload/images", {
              method: "POST",
              body: formData,
            })
            if (res.ok) {
              const { file: uploaded } = await res.json()
              return uploaded.url as string
            }
            return null
          } catch {
            return null
          }
        })
        const results = await Promise.all(uploadPromises)
        imagePaths = results.filter((u): u is string => u !== null)
      }

      const projectData = {
        ...projectForm,
        image_paths: imagePaths.length > 0 ? imagePaths : null,
        image_path: imagePaths.length > 0 ? imagePaths[0] : null,
      }

      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData),
      })

      if (!response.ok) {
        throw new Error("Failed to create project")
      }

      const { project } = await response.json()
      setLocalProjects((prev) => [project, ...prev])
      closeProjectModal()
    } catch (error) {
      console.error("Failed to save project:", error)
      alert("Failed to save project. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <Link
              href="/dashboard"
              className="text-lg font-semibold text-blue-600"
            >
              WorkPortfolio
            </Link>
            <div className="flex items-center space-x-3">
              <Link href="/explore">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-gray-900"
                >
                  <Compass className="w-4 h-4 mr-1" />
                  Explore
                </Button>
              </Link>
              <Link href={`/${user.username}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-sm bg-transparent"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View Portfolio
                </Button>
              </Link>
              <UserButton
                appearance={{ elements: { avatarBox: "w-8 h-8" } }}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* Top row: Profile card + Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Profile Card */}
          <Card className="bg-white shadow-sm border-0 rounded-xl">
            <CardContent className="p-5">
              <div className="flex items-start space-x-4">
                <div className="relative flex-shrink-0">
                  {localUser.avatar_url ? (
                    <img
                      src={localUser.avatar_url}
                      alt={localUser.name || "Avatar"}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white text-lg font-bold">
                      {(localUser.name || localUser.username)
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </div>
                  )}
                  <button
                    onClick={() => setIsAvatarBuilderOpen(true)}
                    className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-1 rounded-full hover:bg-blue-700 transition-colors"
                    title="Create Avatar"
                  >
                    <Palette className="h-3 w-3" />
                  </button>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-gray-900 truncate">
                    {user.name}
                  </h2>
                  <p className="text-sm text-gray-600 truncate">
                    {user.title || "No title set"}
                  </p>

                  {/* Progress bar */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">
                        Profile completeness
                      </span>
                      <span className="text-xs font-medium text-gray-700">
                        {completeness.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          completeness.percentage === 100
                            ? "bg-green-500"
                            : "bg-blue-600"
                        }`}
                        style={{ width: `${completeness.percentage}%` }}
                      />
                    </div>
                    {completeness.missingFields.length > 0 && (
                      <p className="text-xs text-blue-600 mt-2 flex items-center">
                        <Lightbulb className="w-3 h-3 mr-1 flex-shrink-0" />
                        {completeness.missingFields[0]}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <Link href={`/${user.username}?edit=true`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent text-sm"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit Profile
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card className="bg-white shadow-sm border-0 rounded-xl">
            <CardContent className="p-5">
              <div className="grid grid-cols-2 gap-4 h-full">
                <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg">
                  <FolderOpen className="w-5 h-5 text-blue-600 mb-1" />
                  <span className="text-2xl font-bold text-gray-900">
                    {visibleProjectCount}
                  </span>
                  <span className="text-xs text-gray-500">Projects</span>
                </div>
                <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg">
                  <Link2 className="w-5 h-5 text-blue-600 mb-1" />
                  <span className="text-2xl font-bold text-gray-900">
                    {links.length}
                  </span>
                  <span className="text-xs text-gray-500">Links</span>
                </div>
                <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg">
                  <Lightbulb className="w-5 h-5 text-blue-600 mb-1" />
                  <span className="text-2xl font-bold text-gray-900">
                    {skills.length}
                  </span>
                  <span className="text-xs text-gray-500">Skills</span>
                </div>
                <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg">
                  <CalendarDays className="w-5 h-5 text-blue-600 mb-1" />
                  <span className="text-sm font-bold text-gray-900">
                    {memberSince}
                  </span>
                  <span className="text-xs text-gray-500">Joined</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Project CTA */}
        <Card
          className="bg-white shadow-sm border-0 rounded-xl mb-6 cursor-pointer hover:shadow-md transition-shadow"
          onClick={openAddProject}
        >
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Plus className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-gray-500 flex-1">
                What have you been working on?
              </span>
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white flex-shrink-0"
                onClick={(e) => {
                  e.stopPropagation()
                  openAddProject()
                }}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Project
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Projects */}
        <Card className="bg-white shadow-sm border-0 rounded-xl">
          <CardContent className="p-5">
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              Recent Projects
            </h3>

            {recentProjects.length === 0 ? (
              <div className="text-center py-8">
                <FolderOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500 mb-3">
                  No projects yet. Add your first project to get started.
                </p>
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={openAddProject}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Project
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentProjects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    {/* Thumbnail */}
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {project.image_path ||
                      (project.image_paths && project.image_paths.length > 0) ? (
                        <img
                          src={
                            project.image_paths?.[0] ||
                            project.image_path ||
                            ""
                          }
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FileImage className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {project.title}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {project.company || "Personal project"}
                        {!project.visible && (
                          <span className="ml-2 text-amber-600">(Hidden)</span>
                        )}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/${user.username}?edit=true`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1 h-8 w-8"
                        >
                          <Edit className="w-4 h-4 text-gray-500" />
                        </Button>
                      </Link>
                      <Link href={`/${user.username}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1 h-8 w-8"
                        >
                          <Eye className="w-4 h-4 text-gray-500" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}

                {localProjects.length > 5 && (
                  <div className="text-center pt-2">
                    <Link
                      href={`/${user.username}`}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View all on portfolio &rarr;
                    </Link>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Avatar Builder Dialog */}
      <AvatarBuilderDialog
        open={isAvatarBuilderOpen}
        onOpenChange={setIsAvatarBuilderOpen}
        userId={user.id}
        onAvatarSaved={async (publicUrl) => {
          const supabase = createClient()
          const { error } = await supabase
            .from("users")
            .update({ avatar_url: publicUrl })
            .eq("id", user.id)
          if (error) {
            toast.error("Failed to save avatar")
            return
          }
          setLocalUser((prev) => ({ ...prev, avatar_url: publicUrl }))
          toast.success("Avatar updated!")
        }}
      />

      {/* Add Project Dialog */}
      <Dialog open={isAddingProject} onOpenChange={closeProjectModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">
              Add New Project
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Title
              </label>
              <Input
                value={projectForm.title}
                onChange={(e) =>
                  setProjectForm((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                placeholder="Enter project title"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company
              </label>
              <Input
                value={projectForm.company}
                onChange={(e) =>
                  setProjectForm((prev) => ({
                    ...prev,
                    company: e.target.value,
                  }))
                }
                placeholder="Company or organization"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Short Description
              </label>
              <Textarea
                value={projectForm.short_description}
                onChange={(e) =>
                  setProjectForm((prev) => ({
                    ...prev,
                    short_description: e.target.value,
                  }))
                }
                placeholder="5 words or less"
                rows={2}
                className="w-full resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Detailed Description
              </label>
              <Textarea
                value={projectForm.long_description}
                onChange={(e) =>
                  setProjectForm((prev) => ({
                    ...prev,
                    long_description: e.target.value,
                  }))
                }
                placeholder="Share outcomes, metrics, challenges. Use **bold**, *italic*, __underline__, or bullet points."
                rows={4}
                className="w-full resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="month"
                  value={projectForm.start_date}
                  onChange={(e) =>
                    setProjectForm((prev) => ({
                      ...prev,
                      start_date: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="month"
                  value={projectForm.end_date}
                  onChange={(e) =>
                    setProjectForm((prev) => ({
                      ...prev,
                      end_date: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty if ongoing
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project URL
              </label>
              <Input
                value={projectForm.url}
                onChange={(e) =>
                  setProjectForm((prev) => ({ ...prev, url: e.target.value }))
                }
                placeholder="https://your-project.com"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skills/Technologies
              </label>
              <div className="relative">
                <Input
                  value={skillsInput}
                  onChange={(e) => handleSkillsInputChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && skillsInput.trim()) {
                      e.preventDefault()
                      addSkill(skillsInput.trim())
                    }
                  }}
                  placeholder="Start typing to search skills..."
                  className="w-full"
                />
                {showSkillSuggestions && skillSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-40 overflow-y-auto">
                    {skillSuggestions.map((skill) => (
                      <button
                        key={skill}
                        onClick={() => addSkill(skill)}
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {projectForm.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {projectForm.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill(skill)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Images
              </label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  isDragOver
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    Drag and drop images here, or{" "}
                    <label className="text-blue-600 hover:text-blue-700 cursor-pointer">
                      browse files
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,application/pdf"
                        multiple
                        className="hidden"
                        onChange={(e) => handleFileSelect(e.target.files)}
                      />
                    </label>
                  </p>
                  <p className="text-xs text-gray-400">
                    JPEG, PNG, GIF, WebP, PDF -- Max 10MB -- Up to 5 files
                  </p>
                </div>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="mt-3">
                  <DragDropContext onDragEnd={handleImageDragEnd}>
                    <Droppable droppableId="dashboard-project-images">
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="space-y-2"
                        >
                          {uploadedFiles.map((file, index) => (
                            <Draggable
                              key={`${file.name}-${index}`}
                              draggableId={`${file.name}-${index}`}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className={`flex items-center justify-between p-2 bg-gray-50 rounded ${
                                    snapshot.isDragging
                                      ? "shadow-lg scale-105"
                                      : ""
                                  }`}
                                >
                                  <div className="flex items-center">
                                    <div
                                      {...provided.dragHandleProps}
                                      className="mr-2 cursor-grab active:cursor-grabbing"
                                    >
                                      <GripVertical className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <FileImage className="h-4 w-4 text-gray-400 mr-2" />
                                    <span className="text-sm text-gray-700">
                                      {file.name}
                                    </span>
                                    <span className="text-xs text-gray-500 ml-2">
                                      (
                                      {(file.size / 1024 / 1024).toFixed(1)}{" "}
                                      MB)
                                    </span>
                                    {index === 0 && (
                                      <Badge
                                        variant="secondary"
                                        className="ml-2 text-xs"
                                      >
                                        Main Image
                                      </Badge>
                                    )}
                                  </div>
                                  <button
                                    onClick={() => removeFile(index)}
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="dash-visible"
                  checked={projectForm.visible}
                  onChange={(e) =>
                    setProjectForm((prev) => ({
                      ...prev,
                      visible: e.target.checked,
                    }))
                  }
                  className="rounded border-gray-300"
                />
                <label
                  htmlFor="dash-visible"
                  className="text-sm text-gray-700"
                >
                  Make this project visible to visitors
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="dash-featured"
                  checked={projectForm.featured}
                  onChange={(e) =>
                    setProjectForm((prev) => ({
                      ...prev,
                      featured: e.target.checked,
                    }))
                  }
                  className="rounded border-gray-300"
                />
                <label
                  htmlFor="dash-featured"
                  className="text-sm text-gray-700"
                >
                  Feature this project (pin to top)
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                onClick={closeProjectModal}
                variant="outline"
                className="bg-transparent"
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                onClick={saveProject}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={!projectForm.title.trim() || isSaving}
              >
                {isSaving ? "Saving..." : "Add Project"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
