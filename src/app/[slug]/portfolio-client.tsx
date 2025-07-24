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

  // Filter projects based on selected skills
  const filteredProjects =
    selectedSkills.length === 0
      ? projects
      : projects.filter((project) => 
          project.skills && selectedSkills.some((skill) => project.skills!.includes(skill))
        )

  const toggleSkillFilter = (skill: string) => {
    setSelectedSkills((prev) => 
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    )
  }

  const nextImage = () => {
    if (selectedProject && selectedProject.image_paths && selectedProject.image_paths.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === selectedProject.image_paths!.length - 1 ? 0 : prev + 1
      )
    }
  }

  const prevImage = () => {
    if (selectedProject && selectedProject.image_paths && selectedProject.image_paths.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedProject.image_paths!.length - 1 : prev - 1
      )
    }
  }

  const openProjectModal = (project: Project) => {
    console.log('Opening modal for project:', project.title)
    setSelectedProject(project)
    setCurrentImageIndex(0)
  }

  // Get project images - use image_paths if available, otherwise fall back to image_path
  const getProjectImages = (project: Project): string[] => {
    if (project.image_paths && project.image_paths.length > 0) {
      return project.image_paths
    }
    if (project.image_path) {
      return [project.image_path]
    }
    return []
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-xl font-bold text-blue-600">
              WorkPortfolio
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="outline" size="sm" className="font-medium bg-transparent">
                  Create Your Portfolio
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={`${user.name} avatar`}
                className="w-24 h-24 rounded-full mx-auto mb-8 object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-8">
                {(user.name || user.username).split(' ').map(n => n[0]).join('').toUpperCase()}
              </div>
            )}
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight tracking-tight">
              {user.name || user.username}
            </h1>
            <p className="text-xl text-blue-600 font-semibold mb-6">{user.title}</p>
            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto mb-8">
              {portfolio.bio || user.bio}
            </p>

            {/* Social Links */}
            <div className="flex justify-center space-x-4">
              {user.social_links?.linkedin && (
                <Link href={user.social_links.linkedin} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="icon" className="bg-transparent">
                    <Linkedin className="h-5 w-5" />
                    <span className="sr-only">LinkedIn</span>
                  </Button>
                </Link>
              )}
              {user.social_links?.github && (
                <Link href={user.social_links.github} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="icon" className="bg-transparent">
                    <Github className="h-5 w-5" />
                    <span className="sr-only">GitHub</span>
                  </Button>
                </Link>
              )}
              {user.social_links?.twitter && (
                <Link href={user.social_links.twitter} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="icon" className="bg-transparent">
                    <Youtube className="h-5 w-5" />
                    <span className="sr-only">Twitter</span>
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Links Section */}
          {portfolio.show_links && links.length > 0 && (
            <section className="mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 leading-tight tracking-tight">Links</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {links.map((link) => (
                  <Link key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="group">
                    <Card className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                            {getIcon(link.icon || "ExternalLink")}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">{link.title}</h3>
                            {link.description && <p className="text-sm text-gray-600">{link.description}</p>}
                          </div>
                          <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Projects Section */}
          {projects.length > 0 && (
            <section>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 sm:mb-0 leading-tight tracking-tight">
                  Projects
                </h2>
                {selectedSkills.length > 0 && (
                  <Button variant="outline" onClick={() => setSelectedSkills([])} className="text-sm bg-transparent">
                    Clear Filters ({selectedSkills.length})
                  </Button>
                )}
              </div>

              {/* Skills Filter */}
              {allSkills.length > 0 && (
                <div className="mb-8">
                  <p className="text-sm text-gray-600 mb-4">Filter by skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {allSkills.map((skill) => (
                      <button
                        key={skill}
                        onClick={() => toggleSkillFilter(skill)}
                        className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                          selectedSkills.includes(skill)
                            ? "bg-blue-600 text-white shadow-lg"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.map((project) => {
                  const projectImages = getProjectImages(project)
                  return (
                    <Card
                      key={project.id}
                      className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group hover:scale-[1.02]"
                    >
                      <button
                        onClick={() => openProjectModal(project)}
                        className="w-full text-left"
                      >
                        <div className="aspect-video relative overflow-hidden">
                          {projectImages.length > 0 ? (
                            <img
                              src={projectImages[0]}
                              alt={`${project.title} preview`}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-lg font-semibold">
                              {project.title}
                            </div>
                          )}
                          {projectImages.length > 1 && (
                            <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                              +{projectImages.length - 1} more
                            </div>
                          )}
                        </div>
                        <CardContent className="p-6">
                          <div className="mb-4">
                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                              {project.title}
                            </h3>
                            <p className="text-sm text-gray-600 mb-3">{project.company}</p>
                            <p className="text-gray-700 leading-relaxed">{project.short_description}</p>
                          </div>

                          {/* Skills/Tags - only show if skills exist */}
                          {project.skills && project.skills.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {project.skills.slice(0, 3).map((skill) => (
                                <Badge
                                  key={skill}
                                  variant="secondary"
                                  className={`text-xs ${
                                    selectedSkills.includes(skill)
                                      ? "bg-blue-100 text-blue-800 border-blue-200"
                                      : "bg-gray-100 text-gray-700"
                                  }`}
                                >
                                  {skill}
                                </Badge>
                              ))}
                              {project.skills.length > 3 && (
                                <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                                  +{project.skills.length - 3} more
                                </Badge>
                              )}
                            </div>
                          )}

                          {/* Project link - only show if URL exists */}
                          {project.url && (
                            <div className="flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm">
                              View Project <ExternalLink className="h-4 w-4 ml-1" />
                            </div>
                          )}
                        </CardContent>
                      </button>
                    </Card>
                  )
                })}
              </div>

              {filteredProjects.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">No projects found with the selected skills.</p>
                  <Button variant="outline" onClick={() => setSelectedSkills([])} className="mt-4 bg-transparent">
                    Clear Filters
                  </Button>
                </div>
              )}
            </section>
          )}
        </div>
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

                {/* Technologies used */}
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

                {/* Project URL */}
                {selectedProject.url && (
                  <div className="pt-4 border-t">
                    <Link
                      href={selectedProject.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center"
                    >
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                        {selectedProject.url}
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

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <div>
                <p className="text-sm text-gray-500">
                  Created with{" "}
                  <Link href="/" className="font-medium text-blue-600 hover:text-blue-700">
                    WorkPortfolio.io
                  </Link>
                </p>
              </div>
              <Link href="/">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                  Create Your Portfolio
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
} 