"use client"

import Link from "next/link"
import { ExternalLink, Github, Linkedin, Mail, Youtube, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState } from "react"
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
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])

  // Get featured and recent projects
  const featuredProject = projects.find((p) => p.visible) || projects[0]
  const recentProjects = projects.filter((p) => p.visible && p.id !== featuredProject?.id)

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

  // Get project images - use image_paths if available, otherwise fall back to image_path
  const getProjectImages = (project: Project): string[] => {
    if (project.image_paths && project.image_paths.length > 0) {
      return project.image_paths
    }
    if (project.image_path) {
      return [project.image_path]
    }
    return ["/placeholder.svg?height=400&width=600&text=" + encodeURIComponent(project.title)]
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
            <Link href="/">
              <Button variant="outline" size="sm" className="text-sm bg-transparent">
                Create Portfolio
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {/* Hero Section - Simplified */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 mb-8 shadow-sm">
          <div className="flex items-start space-x-4">
            {/* Avatar */}
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={`${user.name} avatar`}
                className="w-16 h-16 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                {(user.name || user.username)
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Hey, I'm {user.name || user.username}
              </h1>
              <p className="text-lg text-gray-600 mb-4">{user.title}</p>
              <p className="text-gray-600 leading-relaxed">{portfolio.bio || user.bio}</p>
            </div>
          </div>
        </div>

        {/* Featured Project - What I'm working on */}
        {featuredProject && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">What I'm working on</h2>
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
          </div>
        )}

        {/* Recent Projects - List format */}
        {recentProjects.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent projects</h2>
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

                      {/* View indicator */}
                      <div className="flex-shrink-0">
                        <ArrowRight className="h-4 w-4 text-gray-400" />
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
        {portfolio.show_links && links.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Links</h2>
            <div className="space-y-3">
              {links.map((link) => (
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
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Project Modal */}
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