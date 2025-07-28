"use client"

import Link from "next/link"
import { ExternalLink, Github, Linkedin, Mail, Youtube, ArrowRight, ChevronLeft, ChevronRight, Edit, Save, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"
import { useUser, UserButton } from "@clerk/nextjs"
import type { User, Portfolio, Project, Link as DatabaseLink } from "@/types/database"

interface PortfolioClientProps {
  user: User
  portfolio: Portfolio
  projects: Project[]
  links: DatabaseLink[]
  allSkills: string[]
}

const getIcon = (iconName: string) => {
  switch (iconName) {
    case "ExternalLink":
      return <ExternalLink className="h-5 w-5" />
    case "Youtube":
      return <Youtube className="h-5 w-5" />
    case "Mail":
      return <Mail className="h-5 w-5" />
    case "Linkedin":
      return <Linkedin className="h-5 w-5" />
    case "Github":
      return <Github className="h-5 w-5" />
    default:
      return <ExternalLink className="h-5 w-5" />
  }
}

export function PortfolioClient({ user, portfolio, projects, links, allSkills }: PortfolioClientProps) {
  const { user: clerkUser, isSignedIn } = useUser()
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  
  // Edit mode states
  const [isEditMode, setIsEditMode] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  // Editable user data
  const [editableUser, setEditableUser] = useState<User>(user)
  const [editableProjects, setEditableProjects] = useState<Project[]>(projects)
  const [editableLinks, setEditableLinks] = useState<DatabaseLink[]>(links)
  
  // Project editing states
  const [isAddingProject, setIsAddingProject] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [projectForm, setProjectForm] = useState({
    title: '',
    company: '',
    short_description: '',
    long_description: '',
    url: '',
    skills: [] as string[],
    visible: true
  })

  // Link editing states
  const [isAddingLink, setIsAddingLink] = useState(false)
  const [editingLink, setEditingLink] = useState<DatabaseLink | null>(null)
  const [linkForm, setLinkForm] = useState({
    title: '',
    url: '',
    description: '',
    icon: 'ExternalLink',
    visible: true
  })

  // Check if current user owns this portfolio
  const isOwner = isSignedIn && clerkUser?.id === user.id

  // Get featured and recent projects (use editable data)
  const currentProjects = isEditMode ? editableProjects : projects
  const featuredProject = currentProjects.find((p) => p.visible) || currentProjects[0]
  const recentProjects = currentProjects.filter((p) => p.visible && p.id !== featuredProject?.id)

  // Filter projects based on selected skills
  const filteredRecentProjects =
    selectedSkills.length === 0
      ? recentProjects
      : recentProjects.filter((project) => 
          project.skills && selectedSkills.some((skill) => project.skills!.includes(skill))
        )

  const toggleSkillFilter = (skill: string) => {
    setSelectedSkills((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]))
  }

  // Edit mode functions
  const enterEditMode = () => {
    setIsEditMode(true)
    // Reset editable data to current state
    setEditableUser(user)
    setEditableProjects(projects)
    setEditableLinks(links)
  }

  const cancelEdit = () => {
    setIsEditMode(false)
    // Reset editable data
    setEditableUser(user)
    setEditableProjects(projects)
    setEditableLinks(links)
  }

  const saveChanges = async () => {
    if (!isOwner) return
    
    setIsSaving(true)
    try {
      // Save user data
      const userResponse = await fetch('/api/users/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editableUser.name,
          title: editableUser.title,
          bio: editableUser.bio,
        }),
      })

      if (!userResponse.ok) {
        throw new Error('Failed to update user')
      }

      // TODO: Save projects and links
      
      setIsEditMode(false)
      // Refresh the page data or update local state
      window.location.reload() // Temporary - should be optimistic updates
    } catch (error) {
      console.error('Failed to save changes:', error)
      alert('Failed to save changes. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  // Project management functions
  const openAddProject = () => {
    setProjectForm({
      title: '',
      company: '',
      short_description: '',
      long_description: '',
      url: '',
      skills: [],
      visible: true
    })
    setEditingProject(null)
    setIsAddingProject(true)
  }

  const openEditProject = (project: Project) => {
    setProjectForm({
      title: project.title,
      company: project.company || '',
      short_description: project.short_description || '',
      long_description: project.long_description || '',
      url: project.url || '',
      skills: project.skills || [],
      visible: project.visible
    })
    setEditingProject(project)
    setIsAddingProject(true)
  }

  const closeProjectModal = () => {
    setIsAddingProject(false)
    setEditingProject(null)
  }

  const saveProject = async () => {
    if (!isOwner) return
    
    try {
      if (editingProject) {
        // Update existing project
        const response = await fetch('/api/projects', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingProject.id,
            ...projectForm
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to update project')
        }

        const { project } = await response.json()
        setEditableProjects(prev => prev.map(p => 
          p.id === editingProject.id ? project : p
        ))
      } else {
        // Add new project
        const response = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projectForm),
        })

        if (!response.ok) {
          throw new Error('Failed to create project')
        }

        const { project } = await response.json()
        setEditableProjects(prev => [project, ...prev])
      }
      
      closeProjectModal()
    } catch (error) {
      console.error('Failed to save project:', error)
      alert('Failed to save project. Please try again.')
    }
  }

  const deleteProject = async (projectId: string) => {
    if (!isOwner) return
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        const response = await fetch(`/api/projects?id=${projectId}`, {
          method: 'DELETE',
        })

        if (!response.ok) {
          throw new Error('Failed to delete project')
        }

        setEditableProjects(prev => prev.filter(p => p.id !== projectId))
      } catch (error) {
        console.error('Failed to delete project:', error)
        alert('Failed to delete project. Please try again.')
      }
    }
  }

  // Link management functions
  const openAddLink = () => {
    setLinkForm({
      title: '',
      url: '',
      description: '',
      icon: 'ExternalLink',
      visible: true
    })
    setEditingLink(null)
    setIsAddingLink(true)
  }

  const openEditLink = (link: DatabaseLink) => {
    setLinkForm({
      title: link.title,
      url: link.url,
      description: link.description || '',
      icon: link.icon || 'ExternalLink',
      visible: link.visible
    })
    setEditingLink(link)
    setIsAddingLink(true)
  }

  const closeLinkModal = () => {
    setIsAddingLink(false)
    setEditingLink(null)
  }

  const saveLink = async () => {
    if (!isOwner) return
    
    try {
      if (editingLink) {
        // Update existing link
        const response = await fetch('/api/links', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingLink.id,
            ...linkForm
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to update link')
        }

        const { link } = await response.json()
        setEditableLinks(prev => prev.map(l => 
          l.id === editingLink.id ? link : l
        ))
      } else {
        // Add new link
        const response = await fetch('/api/links', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(linkForm),
        })

        if (!response.ok) {
          throw new Error('Failed to create link')
        }

        const { link } = await response.json()
        setEditableLinks(prev => [link, ...prev])
      }
      
      closeLinkModal()
    } catch (error) {
      console.error('Failed to save link:', error)
      alert('Failed to save link. Please try again.')
    }
  }

  const deleteLink = async (linkId: string) => {
    if (!isOwner) return
    if (confirm('Are you sure you want to delete this link?')) {
      try {
        const response = await fetch(`/api/links?id=${linkId}`, {
          method: 'DELETE',
        })

        if (!response.ok) {
          throw new Error('Failed to delete link')
        }

        setEditableLinks(prev => prev.filter(l => l.id !== linkId))
      } catch (error) {
        console.error('Failed to delete link:', error)
        alert('Failed to delete link. Please try again.')
      }
    }
  }

  // Get project images - use image_paths if available, otherwise fall back to image_path
  const getProjectImages = (project: Project): string[] => {
    if (project.image_paths && project.image_paths.length > 0) {
      return project.image_paths
    }
    if (project.image_path) {
      return [project.image_path]
    }
    return [`https://via.placeholder.com/600x400/f3f4f6/9ca3af?text=${encodeURIComponent(project.title)}`]
  }

  const nextImage = () => {
    if (selectedProject) {
      const images = getProjectImages(selectedProject)
      setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    }
  }

  const prevImage = () => {
    if (selectedProject) {
      const images = getProjectImages(selectedProject)
      setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    }
  }

  const openProjectModal = (project: Project) => {
    setSelectedProject(project)
    setCurrentImageIndex(0)
  }

  // Format date from ISO string
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Recent"
    try {
      return new Date(dateString).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      })
    } catch {
      return "Recent"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simplified Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <Link href="/" className="text-lg font-semibold text-blue-600">
              WorkPortfolio
            </Link>
            <div className="flex items-center space-x-3">
              {isOwner && !isEditMode && (
                <Button
                  onClick={enterEditMode}
                  variant="outline"
                  size="sm"
                  className="text-sm bg-transparent border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit Portfolio
                </Button>
              )}
              {isEditMode && (
                <>
                  <Button
                    onClick={cancelEdit}
                    variant="outline"
                    size="sm"
                    className="text-sm bg-transparent"
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={saveChanges}
                    size="sm"
                    className="text-sm bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={isSaving}
                  >
                    <Save className="w-4 h-4 mr-1" />
                    {isSaving ? "Saving..." : "Save Now"}
                  </Button>
                </>
              )}
              {!isOwner && !isSignedIn && (
                <Link href="/">
                  <Button variant="outline" size="sm" className="text-sm bg-transparent">
                    Create Portfolio
                  </Button>
                </Link>
              )}
              {/* Always show user button if signed in */}
              {isSignedIn && (
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8"
                    }
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {/* Hero Section - Editable */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 mb-8 shadow-sm">
          <div className="flex items-start space-x-4">
            {/* Avatar */}
            {(isEditMode ? editableUser.avatar_url : user.avatar_url) ? (
              <img
                src={isEditMode ? editableUser.avatar_url : user.avatar_url}
                alt={`${isEditMode ? editableUser.name : user.name} avatar`}
                className="w-16 h-16 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                {((isEditMode ? editableUser.name : user.name) || user.username)
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0">
              {isEditMode ? (
                // Edit mode - show inputs
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <Input
                      value={editableUser.name || ""}
                      onChange={(e) => setEditableUser(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Your full name"
                      className="text-2xl font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <Input
                      value={editableUser.title || ""}
                      onChange={(e) => setEditableUser(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Your professional title"
                      className="text-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <Textarea
                      value={editableUser.bio || ""}
                      onChange={(e) => setEditableUser(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Tell people about yourself..."
                      rows={3}
                      className="resize-none"
                    />
                  </div>
                </div>
              ) : (
                // View mode - show content
                <>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    Hey, I'm {user.name || user.username}
                  </h1>
                  <p className="text-lg text-gray-600 mb-4">{user.title}</p>
                  <p className="text-gray-600 leading-relaxed">{portfolio.bio || user.bio}</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Featured Project - What I'm working on */}
        {(featuredProject || isEditMode) && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">What I'm working on</h2>
              {isEditMode && (
                <Button
                  onClick={openAddProject}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Project
                </Button>
              )}
            </div>
            
            {featuredProject ? (
              <Card
                className="bg-white shadow-sm border-0 rounded-2xl overflow-hidden cursor-pointer hover:shadow-md transition-all duration-200"
                onClick={() => openProjectModal(featuredProject)}
              >
              <div className="p-4">
                {/* Image Grid - Mobile optimized */}
                <div className="grid grid-cols-2 gap-2 mb-4 aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
                  {getProjectImages(featuredProject).slice(0, 4).map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`${featuredProject.title} preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{featuredProject.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {featuredProject.company}, {formatDate(featuredProject.created_at)}
                  </p>
                  <p className="text-gray-700 text-sm leading-relaxed">{featuredProject.short_description}</p>
                </div>
              </div>
            </Card>
            ) : isEditMode ? (
              <Card className="bg-white shadow-sm border-0 rounded-2xl overflow-hidden border-dashed border-gray-300">
                <div className="p-8 text-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-6 h-6 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Add your first project</h3>
                  <p className="text-gray-600 mb-4">Showcase your best work to visitors</p>
                  <Button
                    onClick={openAddProject}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Project
                  </Button>
                </div>
              </Card>
            ) : null}
          </div>
        )}

        {/* Recent Projects - List format */}
        {(recentProjects.length > 0 || isEditMode) && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Recent projects</h2>
              {isEditMode && (
                <Button
                  onClick={openAddProject}
                  size="sm"
                  variant="outline"
                  className="bg-transparent"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              )}
            </div>
            <div className="space-y-3">
              {filteredRecentProjects.map((project) => (
                <Card
                  key={project.id}
                  className="bg-white shadow-sm border-0 rounded-xl overflow-hidden cursor-pointer hover:shadow-md transition-all duration-200"
                  onClick={() => openProjectModal(project)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      {/* Project thumbnail */}
                      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                        <img
                          src={getProjectImages(project)[0]}
                          alt={`${project.title} thumbnail`}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Project info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">{project.title}</h3>
                        <p className="text-xs text-gray-600 mb-1">
                          {project.company}, {formatDate(project.created_at)}
                        </p>
                        <p className="text-xs text-gray-700 leading-relaxed line-clamp-2">{project.short_description}</p>
                      </div>

                      {/* View indicator or Edit buttons */}
                      <div className="flex-shrink-0">
                        {isEditMode ? (
                          <div className="flex items-center space-x-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                openEditProject(project)
                              }}
                              className="p-1 h-8 w-8"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteProject(project.id)
                              }}
                              className="p-1 h-8 w-8 text-red-600 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <ArrowRight className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredRecentProjects.length === 0 && selectedSkills.length > 0 && (
              <div className="text-center py-8">
                <p className="text-gray-600 text-sm mb-3">No projects found with the selected skills.</p>
                <Button variant="outline" size="sm" onClick={() => setSelectedSkills([])} className="bg-transparent">
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Skills Filter - Simplified for mobile */}
        {allSkills.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-600">Filter by skills:</p>
              {selectedSkills.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedSkills([])}
                  className="text-xs text-blue-600 p-0 h-auto"
                >
                  Clear ({selectedSkills.length})
                </Button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {allSkills.map((skill) => (
                <button
                  key={skill}
                  onClick={() => toggleSkillFilter(skill)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    selectedSkills.includes(skill)
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Links Section - Moved to bottom */}
        {(links.length > 0 || isEditMode) && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Links</h2>
              {isEditMode && (
                <Button
                  onClick={openAddLink}
                  size="sm"
                  variant="outline"
                  className="bg-transparent"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Link
                </Button>
              )}
            </div>
            <div className="space-y-3">
              {(isEditMode ? editableLinks : links).map((link) => (
                isEditMode ? (
                  <Card key={link.id} className="bg-white shadow-sm border-0 rounded-xl overflow-hidden hover:shadow-md transition-all duration-200">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 flex-shrink-0">
                          {getIcon(link.icon || "ExternalLink")}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-sm mb-1">{link.title}</h3>
                          {link.description && <p className="text-xs text-gray-600">{link.description}</p>}
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openEditLink(link)}
                            className="p-1 h-8 w-8"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteLink(link.id)}
                            className="p-1 h-8 w-8 text-red-600 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Link key={link.id} href={link.url} target="_blank" rel="noopener noreferrer">
                    <Card className="bg-white shadow-sm border-0 rounded-xl overflow-hidden hover:shadow-md transition-all duration-200">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 flex-shrink-0">
                            {getIcon(link.icon || "ExternalLink")}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 text-sm mb-1">{link.title}</h3>
                            {link.description && <p className="text-xs text-gray-600">{link.description}</p>}
                          </div>
                          <ExternalLink className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              ))}
              
              {isEditMode && editableLinks.length === 0 && (
                <Card className="bg-white shadow-sm border-0 rounded-xl overflow-hidden border-dashed border-gray-300">
                  <div className="p-6 text-center">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Plus className="w-5 h-5 text-gray-400" />
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">Add your first link</h3>
                    <p className="text-xs text-gray-600 mb-3">Share your social profiles or website</p>
                    <Button
                      onClick={openAddLink}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Link
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Link Edit/Add Modal */}
      <Dialog open={isAddingLink} onOpenChange={closeLinkModal}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">
              {editingLink ? 'Edit Link' : 'Add New Link'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Link Title</label>
              <Input
                value={linkForm.title}
                onChange={(e) => setLinkForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. LinkedIn Profile, GitHub, Website"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
              <Input
                value={linkForm.url}
                onChange={(e) => setLinkForm(prev => ({ ...prev, url: e.target.value }))}
                placeholder="https://example.com"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
              <Input
                value={linkForm.description}
                onChange={(e) => setLinkForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of this link"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
              <select
                value={linkForm.icon}
                onChange={(e) => setLinkForm(prev => ({ ...prev, icon: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ExternalLink">External Link</option>
                <option value="Github">GitHub</option>
                <option value="Linkedin">LinkedIn</option>
                <option value="Mail">Email</option>
                <option value="Youtube">YouTube</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="linkVisible"
                checked={linkForm.visible}
                onChange={(e) => setLinkForm(prev => ({ ...prev, visible: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <label htmlFor="linkVisible" className="text-sm text-gray-700">
                Make this link visible to visitors
              </label>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                onClick={closeLinkModal}
                variant="outline"
                className="bg-transparent"
              >
                Cancel
              </Button>
              <Button
                onClick={saveLink}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={!linkForm.title.trim() || !linkForm.url.trim()}
              >
                {editingLink ? 'Update Link' : 'Add Link'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Project Edit/Add Modal */}
      <Dialog open={isAddingProject} onOpenChange={closeProjectModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">
              {editingProject ? 'Edit Project' : 'Add New Project'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
              <Input
                value={projectForm.title}
                onChange={(e) => setProjectForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter project title"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
              <Input
                value={projectForm.company}
                onChange={(e) => setProjectForm(prev => ({ ...prev, company: e.target.value }))}
                placeholder="Company or organization"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
              <Textarea
                value={projectForm.short_description}
                onChange={(e) => setProjectForm(prev => ({ ...prev, short_description: e.target.value }))}
                placeholder="Brief description for project cards"
                rows={2}
                className="w-full resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Detailed Description</label>
              <Textarea
                value={projectForm.long_description}
                onChange={(e) => setProjectForm(prev => ({ ...prev, long_description: e.target.value }))}
                placeholder="Detailed description for project modal"
                rows={4}
                className="w-full resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project URL</label>
              <Input
                value={projectForm.url}
                onChange={(e) => setProjectForm(prev => ({ ...prev, url: e.target.value }))}
                placeholder="https://your-project.com"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Skills/Technologies</label>
              <Input
                value={projectForm.skills.join(', ')}
                onChange={(e) => setProjectForm(prev => ({ 
                  ...prev, 
                  skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                }))}
                placeholder="React, TypeScript, Node.js (comma separated)"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Images</label>
              <input
                type="file"
                accept="image/*"
                multiple
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => {
                  // TODO: Implement image upload to Supabase storage
                  console.log('Files selected:', e.target.files)
                }}
              />
              <p className="text-xs text-gray-500 mt-1">
                Upload images for your project (multiple files supported)
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="visible"
                checked={projectForm.visible}
                onChange={(e) => setProjectForm(prev => ({ ...prev, visible: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <label htmlFor="visible" className="text-sm text-gray-700">
                Make this project visible to visitors
              </label>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                onClick={closeProjectModal}
                variant="outline"
                className="bg-transparent"
              >
                Cancel
              </Button>
              <Button
                onClick={saveProject}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={!projectForm.title.trim()}
              >
                {editingProject ? 'Update Project' : 'Add Project'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Project View Modal */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedProject && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">{selectedProject.title}</DialogTitle>
                <p className="text-blue-600 font-medium">{selectedProject.company}</p>
              </DialogHeader>

              <div className="space-y-6">
                {/* Image Carousel */}
                {(() => {
                  const projectImages = getProjectImages(selectedProject)
                  return projectImages.length > 0 ? (
                    <div className="relative">
                      <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden">
                        <img
                          src={projectImages[currentImageIndex]}
                          alt={`${selectedProject.title} - Image ${currentImageIndex + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {projectImages.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                          >
                            <ChevronLeft className="h-5 w-5" />
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                          >
                            <ChevronRight className="h-5 w-5" />
                          </button>

                          {/* Image indicators */}
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                            {projectImages.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`w-2 h-2 rounded-full transition-colors ${
                                  index === currentImageIndex ? "bg-white" : "bg-white/50"
                                }`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  ) : null
                })()}

                {/* Project Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">About this project</h3>
                  <p className="text-gray-700 leading-relaxed">{selectedProject.long_description}</p>
                </div>

                {selectedProject.skills && selectedProject.skills.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Technologies used</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedProject.url && (
                  <div className="pt-4 border-t">
                    <Link
                      href={selectedProject.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center"
                    >
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                        View Project
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Simplified Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
            <p className="text-xs text-gray-500">
              Created with{" "}
              <Link href="/" className="font-medium text-blue-600 hover:text-blue-700">
                WorkPortfolio.io
              </Link>
            </p>
            <Link href="/">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs">
                Create Your Portfolio
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}