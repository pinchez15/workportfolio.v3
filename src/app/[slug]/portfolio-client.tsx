"use client"

import Link from "next/link"
import { ExternalLink, Github, Linkedin, Mail, Youtube, ArrowRight, ChevronLeft, ChevronRight, Edit, Save, Plus, X, Upload, FileImage, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"
import { useUser, UserButton } from "@clerk/nextjs"
import type { User, Portfolio, Project, Link as DatabaseLink } from "@/types/database"
import { getSkillSuggestions } from "@/lib/skills"
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd"

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

// Helper function to render formatted text
const renderFormattedText = (text: string) => {
  if (!text) return '';
  
  // Convert markdown-like syntax to HTML
  let formattedText = text
    // Bold: **text** -> <strong>text</strong>
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic: *text* -> <em>text</em>
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Underline: __text__ -> <u>text</u>
    .replace(/__(.*?)__/g, '<u>$1</u>')
    // Convert line breaks to <br> tags
    .replace(/\n/g, '<br>');
  
  // Handle bullet points and numbered lists line by line
  const lines = text.split('\n');
  const formattedLines = lines.map(line => {
    if (line.trim().startsWith('• ')) {
      return `<li>${line.trim().substring(2)}</li>`;
    }
    if (/^\d+\.\s/.test(line.trim())) {
      return `<li>${line.trim().replace(/^\d+\.\s/, '')}</li>`;
    }
    return line;
  });
  
  // Join lines and wrap lists in <ul> tags
  formattedText = formattedLines.join('<br>');
  if (formattedText.includes('<li>')) {
    formattedText = formattedText.replace(/(<li>.*?<\/li>)/gs, '<ul>$1</ul>');
  }
  
  return formattedText;
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
    start_date: '',
    end_date: '',
    url: '',
    skills: [] as string[],
    visible: true,
    featured: false
  })

  // Image upload states
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isDragOver, setIsDragOver] = useState(false)

  // Skills search states
  const [skillsInput, setSkillsInput] = useState('')
  const [skillSuggestions, setSkillSuggestions] = useState<string[]>([])
  const [showSkillSuggestions, setShowSkillSuggestions] = useState(false)

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

  // Drag and drop handlers
  const handleProjectDragEnd = async (result: DropResult) => {
    if (!result.destination || !isOwner) return;
    
    const items = Array.from(editableProjects);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Update order_index for all items
    const updatedItems = items.map((item, index) => ({
      ...item,
      order_index: index
    }));
    
    setEditableProjects(updatedItems);
    
    // Save the new order to the database
    try {
      const updatePromises = updatedItems.map((project) =>
        fetch('/api/projects', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: project.id,
            order_index: project.order_index
          }),
        })
      );
      
      await Promise.all(updatePromises);
    } catch (error) {
      console.error('Failed to save project order:', error);
      // Revert to original order on error
      setEditableProjects(projects);
    }
  };

  const handleLinkDragEnd = async (result: DropResult) => {
    if (!result.destination || !isOwner) return;
    
    const items = Array.from(editableLinks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Update order_index for all items
    const updatedItems = items.map((item, index) => ({
      ...item,
      order_index: index
    }));
    
    setEditableLinks(updatedItems);
    
    // Save the new order to the database
    try {
      const updatePromises = updatedItems.map((link) =>
        fetch('/api/links', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: link.id,
            order_index: link.order_index
          }),
        })
      );
      
      await Promise.all(updatePromises);
    } catch (error) {
      console.error('Failed to save link order:', error);
      // Revert to original order on error
      setEditableLinks(links);
    }
  };

  // Keyboard shortcuts for rich text formatting
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle shortcuts when the project modal is open
      if (!isAddingProject) return;
      
      const textarea = document.getElementById('long-description') as HTMLTextAreaElement;
      if (!textarea || document.activeElement !== textarea) return;
      
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        
        switch (e.key.toLowerCase()) {
          case 'b':
            // Bold
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const text = textarea.value;
            const before = text.substring(0, start);
            const selected = text.substring(start, end);
            const after = text.substring(end);
            
            if (start === end) {
              const newText = before + '**bold text**' + after;
              setProjectForm(prev => ({ ...prev, long_description: newText }));
              setTimeout(() => {
                textarea.focus();
                textarea.setSelectionRange(start + 2, start + 10);
              }, 0);
            } else {
              const newText = before + '**' + selected + '**' + after;
              setProjectForm(prev => ({ ...prev, long_description: newText }));
              setTimeout(() => {
                textarea.focus();
                textarea.setSelectionRange(start, start + selected.length + 4);
              }, 0);
            }
            break;
            
          case 'i':
            // Italic
            const startI = textarea.selectionStart;
            const endI = textarea.selectionEnd;
            const textI = textarea.value;
            const beforeI = textI.substring(0, startI);
            const selectedI = textI.substring(startI, endI);
            const afterI = textI.substring(endI);
            
            if (startI === endI) {
              const newText = beforeI + '*italic text*' + afterI;
              setProjectForm(prev => ({ ...prev, long_description: newText }));
              setTimeout(() => {
                textarea.focus();
                textarea.setSelectionRange(startI + 1, startI + 12);
              }, 0);
            } else {
              const newText = beforeI + '*' + selectedI + '*' + afterI;
              setProjectForm(prev => ({ ...prev, long_description: newText }));
              setTimeout(() => {
                textarea.focus();
                textarea.setSelectionRange(startI, startI + selectedI.length + 2);
              }, 0);
            }
            break;
            
          case 'u':
            // Underline
            const startU = textarea.selectionStart;
            const endU = textarea.selectionEnd;
            const textU = textarea.value;
            const beforeU = textU.substring(0, startU);
            const selectedU = textU.substring(startU, endU);
            const afterU = textU.substring(endU);
            
            if (startU === endU) {
              const newText = beforeU + '__underline text__' + afterU;
              setProjectForm(prev => ({ ...prev, long_description: newText }));
              setTimeout(() => {
                textarea.focus();
                textarea.setSelectionRange(startU + 2, startU + 15);
              }, 0);
            } else {
              const newText = beforeU + '__' + selectedU + '__' + afterU;
              setProjectForm(prev => ({ ...prev, long_description: newText }));
              setTimeout(() => {
                textarea.focus();
                textarea.setSelectionRange(startU, startU + selectedU.length + 4);
              }, 0);
            }
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isAddingProject]);

  // Utility function to ensure URLs have proper protocol
  const formatUrl = (url: string): string => {
    if (!url) return url
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url
    }
    return `https://${url}`
  }

  // Get featured and recent projects (use editable data)
  const currentProjects = isEditMode ? editableProjects : projects
  const featuredProject = currentProjects.find((p) => p.visible && p.featured) || currentProjects.find((p) => p.visible) || currentProjects[0]
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
      start_date: '',
      end_date: '',
      url: '',
      skills: [],
      visible: true,
      featured: false
    })
    setEditingProject(null)
    setUploadedFiles([])
    setIsAddingProject(true)
  }

  // Convert database date (YYYY-MM-DD) back to month format (YYYY-MM)
  const formatDateForForm = (dateStr: string) => {
    if (!dateStr) return ''
    return dateStr.substring(0, 7) // Convert "2025-02-01" to "2025-02"
  }

  const openEditProject = (project: Project) => {
    setProjectForm({
      title: project.title,
      company: project.company || '',
      short_description: project.short_description || '',
      long_description: project.long_description || '',
      start_date: formatDateForForm(project.start_date || ''),
      end_date: formatDateForForm(project.end_date || ''),
      url: project.url || '',
      skills: project.skills || [],
      visible: project.visible,
      featured: project.featured || false
    })
    setEditingProject(project)
    setUploadedFiles([])
    setIsAddingProject(true)
  }

  const closeProjectModal = () => {
    setIsAddingProject(false)
    setEditingProject(null)
    setUploadedFiles([])
  }

  // Image upload handlers
  const handleFileSelect = (files: FileList | null) => {
    if (!files) return
    
    const validFiles = Array.from(files).filter(file => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'application/pdf']
      const maxSize = 10 * 1024 * 1024 // 10MB
      
      console.log(`Processing file: ${file.name}, size: ${file.size}, type: ${file.type}`)
      
      if (!validTypes.includes(file.type)) {
        alert(`File type not supported: ${file.type}`)
        return false
      }
      
      if (file.size > maxSize) {
        alert(`File too large: ${file.name} (${(file.size / 1024 / 1024).toFixed(1)} MB). Max size is 10MB.`)
        return false
      }
      
      if (file.size === 0) {
        alert(`File appears to be empty: ${file.name}`)
        return false
      }
      
      return true
    })
    
    setUploadedFiles(prev => [...prev, ...validFiles].slice(0, 5)) // Max 5 files
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
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  // Skills management
  const handleSkillsInputChange = (value: string) => {
    setSkillsInput(value)
    if (value.trim()) {
      const suggestions = getSkillSuggestions(value)
      setSkillSuggestions(suggestions)
      setShowSkillSuggestions(true)
    } else {
      setShowSkillSuggestions(false)
    }
  }

  const addSkill = (skill: string) => {
    if (!projectForm.skills.includes(skill)) {
      setProjectForm(prev => ({ 
        ...prev, 
        skills: [...prev.skills, skill]
      }))
    }
    setSkillsInput('')
    setShowSkillSuggestions(false)
  }

  const removeSkill = (skillToRemove: string) => {
    setProjectForm(prev => ({ 
      ...prev, 
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }))
  }

  const saveProject = async () => {
    if (!isOwner) return
    
    try {
      let imagePaths: string[] = []

      // Upload images if any are selected (one by one to avoid size limits)
      if (uploadedFiles.length > 0) {
        const uploadPromises = uploadedFiles.map(async (file) => {
          const formData = new FormData()
          formData.append('file', file)

          try {
            const uploadResponse = await fetch('/api/upload/images', {
              method: 'POST',
              body: formData,
            })

            if (uploadResponse.ok) {
              const { file: uploadedFile } = await uploadResponse.json()
              return uploadedFile.url
            } else {
              const errorData = await uploadResponse.json()
              console.warn(`Failed to upload ${file.name}:`, errorData.error)
              return null
            }
          } catch (error) {
            console.warn(`Failed to upload ${file.name}:`, error)
            return null
          }
        })

        const uploadResults = await Promise.all(uploadPromises)
        imagePaths = uploadResults.filter(url => url !== null) as string[]
        
        if (imagePaths.length === 0 && uploadedFiles.length > 0) {
          alert('All image uploads failed. The project will be saved without images.')
        } else if (imagePaths.length < uploadedFiles.length) {
          alert(`${uploadedFiles.length - imagePaths.length} image(s) failed to upload. The project will be saved with the successful uploads.`)
        }
      }

      const projectData = {
        ...projectForm,
        image_paths: imagePaths.length > 0 ? imagePaths : (editingProject?.image_paths || null),
        image_path: imagePaths.length > 0 ? imagePaths[0] : (editingProject?.image_path || null)
      }

      if (editingProject) {
        // Update existing project
        const response = await fetch('/api/projects', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingProject.id,
            ...projectData
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
          body: JSON.stringify(projectData),
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
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

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
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
                onClick={() => isEditMode ? openEditProject(featuredProject) : openProjectModal(featuredProject)}
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
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{featuredProject.short_description}</p>
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
            
            <DragDropContext onDragEnd={handleProjectDragEnd}>
              <Droppable droppableId="projects" direction="horizontal">
                {(provided) => (
                  <div 
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
                  >
                    {filteredRecentProjects.map((project, index) => (
                      <Draggable key={project.id} draggableId={project.id} index={index}>
                        {(provided, snapshot) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`bg-white shadow-sm border-0 rounded-xl overflow-hidden cursor-pointer hover:shadow-md transition-all duration-200 ${
                              snapshot.isDragging ? 'shadow-lg scale-105' : ''
                            }`}
                            onClick={() => openProjectModal(project)}
                          >
                            <CardContent className="p-4">
                              {/* Drag Handle - Only show in edit mode */}
                              {isEditMode && (
                                <div
                                  {...provided.dragHandleProps}
                                  className="flex justify-end mb-2"
                                >
                                  <GripVertical className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing" />
                                </div>
                              )}
                              
                              {/* Project Image */}
                              <div className="relative w-full h-32 mb-3 rounded-lg overflow-hidden bg-gray-100">
                                {getProjectImages(project).length > 0 ? (
                                  <img
                                    src={getProjectImages(project)[0]}
                                    alt={project.title}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <FileImage className="h-8 w-8" />
                                  </div>
                                )}
                              </div>

                              <div>
                                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{project.title}</h3>
                                
                                <div className="flex items-center justify-between mb-2">
                                  <p className="text-sm text-gray-600">
                                    {project.company} • {formatDate(project.created_at)}
                                  </p>
                                  {isEditMode ? (
                                    <div className="flex items-center space-x-1 flex-shrink-0">
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          openEditProject(project)
                                        }}
                                        className="p-1 h-7 w-7"
                                      >
                                        <Edit className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          deleteProject(project.id)
                                        }}
                                        className="p-1 h-7 w-7 text-red-600 hover:text-red-700"
                                      >
                                        <X className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  ) : (
                                    <ArrowRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                  )}
                                </div>
                                
                                <p className="text-sm text-gray-700 leading-relaxed line-clamp-3 whitespace-pre-wrap">{project.short_description}</p>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            
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
            
            <DragDropContext onDragEnd={handleLinkDragEnd}>
              <Droppable droppableId="links">
                {(provided) => (
                  <div 
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-3"
                  >
                    {(isEditMode ? editableLinks : links).map((link, index) => (
                      <Draggable key={link.id} draggableId={link.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`${snapshot.isDragging ? 'shadow-lg scale-105' : ''}`}
                          >
                            {isEditMode ? (
                              <Card className="bg-white shadow-sm border-0 rounded-xl overflow-hidden hover:shadow-md transition-all duration-200">
                                <CardContent className="py-2 px-4">
                                  <div className="flex items-center space-x-4">
                                    {/* Drag Handle - Only show in edit mode */}
                                    <div
                                      {...provided.dragHandleProps}
                                      className="flex-shrink-0"
                                    >
                                      <GripVertical className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing" />
                                    </div>
                                    
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
                              <Link href={formatUrl(link.url)} target="_blank" rel="noopener noreferrer">
                                <Card className="bg-white shadow-sm border-0 rounded-xl overflow-hidden hover:shadow-md transition-all duration-200">
                                  <CardContent className="py-2 px-4">
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
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            
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
        )}
      </main>

      {/* Link Edit/Add Modal */}
      <Dialog open={isAddingLink} onOpenChange={closeLinkModal}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto sm:max-w-xl">
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto sm:max-w-4xl">
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
                placeholder="5 words or less"
                rows={2}
                className="w-full resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Detailed Description</label>
              
              {/* Rich Text Formatting Toolbar */}
              <div className="mb-2 flex items-center gap-1 p-2 bg-gray-50 border border-gray-200 rounded-md">
                <button
                  type="button"
                  onClick={() => {
                    const textarea = document.getElementById('long-description') as HTMLTextAreaElement;
                    if (textarea) {
                      const start = textarea.selectionStart;
                      const end = textarea.selectionEnd;
                      const text = textarea.value;
                      const before = text.substring(0, start);
                      const selected = text.substring(start, end);
                      const after = text.substring(end);
                      
                      if (start === end) {
                        // No text selected, insert **bold** markers
                        const newText = before + '**bold text**' + after;
                        setProjectForm(prev => ({ ...prev, long_description: newText }));
                        // Set cursor position after the markers
                        setTimeout(() => {
                          textarea.focus();
                          textarea.setSelectionRange(start + 2, start + 10);
                        }, 0);
                      } else {
                        // Text selected, wrap with **
                        const newText = before + '**' + selected + '**' + after;
                        setProjectForm(prev => ({ ...prev, long_description: newText }));
                        // Set cursor position after the wrapped text
                        setTimeout(() => {
                          textarea.focus();
                          textarea.setSelectionRange(start, start + selected.length + 4);
                        }, 0);
                      }
                    }
                  }}
                  className="p-2 hover:bg-gray-200 rounded text-sm font-bold border border-transparent hover:border-gray-300 transition-colors"
                  title="Bold (Ctrl+B)"
                >
                  B
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    const textarea = document.getElementById('long-description') as HTMLTextAreaElement;
                    if (textarea) {
                      const start = textarea.selectionStart;
                      const end = textarea.selectionEnd;
                      const text = textarea.value;
                      const before = text.substring(0, start);
                      const selected = text.substring(start, end);
                      const after = text.substring(end);
                      
                      if (start === end) {
                        // No text selected, insert *italic* markers
                        const newText = before + '*italic text*' + after;
                        setProjectForm(prev => ({ ...prev, long_description: newText }));
                        // Set cursor position after the markers
                        setTimeout(() => {
                          textarea.focus();
                          textarea.setSelectionRange(start + 1, start + 12);
                        }, 0);
                      } else {
                        // Text selected, wrap with *
                        const newText = before + '*' + selected + '*' + after;
                        setProjectForm(prev => ({ ...prev, long_description: newText }));
                        // Set cursor position after the wrapped text
                        setTimeout(() => {
                          textarea.focus();
                          textarea.setSelectionRange(start, start + selected.length + 2);
                        }, 0);
                      }
                    }
                  }}
                  className="p-2 hover:bg-gray-200 rounded text-sm italic border border-transparent hover:border-gray-300 transition-colors"
                  title="Italic (Ctrl+I)"
                >
                  I
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    const textarea = document.getElementById('long-description') as HTMLTextAreaElement;
                    if (textarea) {
                      const start = textarea.selectionStart;
                      const end = textarea.selectionEnd;
                      const text = textarea.value;
                      const before = text.substring(0, start);
                      const selected = text.substring(start, end);
                      const after = text.substring(end);
                      
                      if (start === end) {
                        // No text selected, insert __underline__ markers
                        const newText = before + '__underline text__' + after;
                        setProjectForm(prev => ({ ...prev, long_description: newText }));
                        // Set cursor position after the markers
                        setTimeout(() => {
                          textarea.focus();
                          textarea.setSelectionRange(start + 2, start + 15);
                        }, 0);
                      } else {
                        // Text selected, wrap with __
                        const newText = before + '__' + selected + '__' + after;
                        setProjectForm(prev => ({ ...prev, long_description: newText }));
                        // Set cursor position after the wrapped text
                        setTimeout(() => {
                          textarea.focus();
                          textarea.setSelectionRange(start, start + selected.length + 4);
                        }, 0);
                      }
                    }
                  }}
                  className="p-2 hover:bg-gray-200 rounded text-sm underline border border-transparent hover:border-gray-300 transition-colors"
                  title="Underline (Ctrl+U)"
                >
                  U
                </button>
                
                <div className="w-px h-6 bg-gray-300 mx-2"></div>
                
                <button
                  type="button"
                  onClick={() => {
                    const textarea = document.getElementById('long-description') as HTMLTextAreaElement;
                    if (textarea) {
                      const start = textarea.selectionStart;
                      const text = textarea.value;
                      const before = text.substring(0, start);
                      const after = text.substring(start);
                      const newText = before + '• ' + after;
                      setProjectForm(prev => ({ ...prev, long_description: newText }));
                      // Set cursor position after the bullet
                      setTimeout(() => {
                        textarea.focus();
                        textarea.setSelectionRange(start + 2, start + 2);
                      }, 0);
                    }
                  }}
                  className="p-2 hover:bg-gray-200 rounded text-sm border border-transparent hover:border-gray-300 transition-colors"
                  title="Add bullet point"
                >
                  •
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    const textarea = document.getElementById('long-description') as HTMLTextAreaElement;
                    if (textarea) {
                      const start = textarea.selectionStart;
                      const text = textarea.value;
                      const before = text.substring(0, start);
                      const after = text.substring(start);
                      const newText = before + '1. ' + after;
                      setProjectForm(prev => ({ ...prev, long_description: newText }));
                      // Set cursor position after the number
                      setTimeout(() => {
                        textarea.focus();
                        textarea.setSelectionRange(start + 3, start + 3);
                      }, 0);
                    }
                  }}
                  className="p-2 hover:bg-gray-200 rounded text-sm border border-transparent hover:border-gray-300 transition-colors"
                  title="Add numbered list"
                >
                  1.
                </button>
                
                <div className="w-px h-6 bg-gray-300 mx-2"></div>
                
                <span className="text-xs text-gray-500 px-2">
                  Use **bold**, *italic*, __underline__, • bullets, or 1. numbers
                </span>
              </div>
              
              <Textarea
                id="long-description"
                value={projectForm.long_description}
                onChange={(e) => setProjectForm(prev => ({ ...prev, long_description: e.target.value }))}
                placeholder="Share as much as you'd like! Include outcomes, metrics and challenges if any. Use the toolbar above for formatting."
                rows={4}
                className="w-full resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="month"
                  value={projectForm.start_date}
                  onChange={(e) => setProjectForm(prev => ({ ...prev, start_date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="month"
                  value={projectForm.end_date}
                  onChange={(e) => setProjectForm(prev => ({ ...prev, end_date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty if ongoing</p>
              </div>
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
              <div className="relative">
                <Input
                  value={skillsInput}
                  onChange={(e) => handleSkillsInputChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && skillsInput.trim()) {
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Images</label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    Drag and drop images here, or{' '}
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
                  <p className="text-xs text-gray-500 mb-1">
                    Upload screenshots, mockups, or project visuals
                  </p>
                  <p className="text-xs text-gray-400">
                    Supports: JPEG, PNG, GIF, WebP, PDF • Max 10MB per file • Up to 5 files
                  </p>
                </div>
              </div>
              
              {uploadedFiles.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-2">Drag to reorder images (first image will be the main project image)</p>
                  <DragDropContext onDragEnd={(result) => {
                    if (!result.destination) return;
                    
                    const items = Array.from(uploadedFiles);
                    const [reorderedItem] = items.splice(result.source.index, 1);
                    items.splice(result.destination.index, 0, reorderedItem);
                    
                    setUploadedFiles(items);
                  }}>
                    <Droppable droppableId="project-images">
                      {(provided) => (
                        <div 
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="space-y-2"
                        >
                          {uploadedFiles.map((file, index) => (
                            <Draggable key={`${file.name}-${index}`} draggableId={`${file.name}-${index}`} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className={`flex items-center justify-between p-2 bg-gray-50 rounded ${
                                    snapshot.isDragging ? 'shadow-lg scale-105' : ''
                                  }`}
                                >
                                  <div className="flex items-center">
                                    {/* Drag Handle */}
                                    <div
                                      {...provided.dragHandleProps}
                                      className="mr-2 cursor-grab active:cursor-grabbing"
                                    >
                                      <GripVertical className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                                    </div>
                                    
                                    <FileImage className="h-4 w-4 text-gray-400 mr-2" />
                                    <span className="text-sm text-gray-700">{file.name}</span>
                                    <span className="text-xs text-gray-500 ml-2">
                                      ({(file.size / 1024 / 1024).toFixed(1)} MB)
                                    </span>
                                    {index === 0 && (
                                      <Badge variant="secondary" className="ml-2 text-xs">
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
                  id="visible"
                  checked={projectForm.visible}
                  onChange={(e) => setProjectForm(prev => ({ ...prev, visible: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                <label htmlFor="visible" className="text-sm text-gray-700">
                  Make this project visible to visitors
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={projectForm.featured}
                  onChange={(e) => setProjectForm(prev => ({ ...prev, featured: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                <label htmlFor="featured" className="text-sm text-gray-700">
                  Feature this project (show in "What I'm working on" section)
                </label>
              </div>
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
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto sm:max-w-6xl">
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
                  <div 
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ 
                      __html: renderFormattedText(selectedProject.long_description || '') 
                    }}
                  />
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
                      href={formatUrl(selectedProject.url)}
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
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