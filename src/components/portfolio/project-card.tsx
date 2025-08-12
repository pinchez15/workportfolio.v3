"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X, Calendar, Building } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Project } from "@/types/database"

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

interface ProjectCardProps {
  project: {
    title: string
    company?: string
    short_description?: string
    long_description?: string
    start_date?: string
    end_date?: string
    image_paths?: string[]
    tags?: string[]
    skills?: string[]
  }
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isExpanded, setIsExpanded] = useState(false)
  const [expandedImageIndex, setExpandedImageIndex] = useState(0)

  const images = project.image_paths || []
  const hasImages = images.length > 0

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const nextExpandedImage = () => {
    setExpandedImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevExpandedImage = () => {
    setExpandedImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  return (
    <>
      <Card 
        className="overflow-hidden transition-all duration-200 hover:shadow-lg cursor-pointer group"
        onClick={() => setIsExpanded(true)}
      >
        <CardContent className="p-0">
          {/* Image Carousel */}
          {hasImages && (
            <div className="relative h-48 bg-gray-100">
              <Image
                src={images[currentImageIndex]}
                alt={`${project.title} - Image ${currentImageIndex + 1}`}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              
              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      prevImage()
                    }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      nextImage()
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  
                  {/* Image Indicators */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
                    {images.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Project Content */}
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
            
            {project.company && (
              <p className="text-sm text-gray-600 flex items-center mb-2">
                <Building className="h-3 w-3 mr-1" />
                {project.company}
              </p>
            )}
            
            {(project.start_date || project.end_date) && (
              <p className="text-sm text-gray-600 flex items-center mb-3">
                <Calendar className="h-3 w-3 mr-1" />
                {formatDate(project.start_date || "")} - {project.end_date ? formatDate(project.end_date) : "Present"}
              </p>
            )}
            
            {project.short_description && (
              <p className="text-gray-600 mb-4">{project.short_description}</p>
            )}
            
            {/* Tags */}
            {project.tags && project.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Expanded View Dialog */}
      <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{project.title}</span>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Expanded Image Carousel */}
            {hasImages && (
              <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={images[expandedImageIndex]}
                  alt={`${project.title} - Image ${expandedImageIndex + 1}`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 75vw"
                />
                
                {/* Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevExpandedImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={nextExpandedImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                    
                    {/* Image Counter */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                      {expandedImageIndex + 1} / {images.length}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Project Details */}
            <div className="space-y-4">
              {project.company && (
                <div className="flex items-center text-gray-600">
                  <Building className="h-4 w-4 mr-2" />
                  <span>{project.company}</span>
                </div>
              )}
              
              {(project.start_date || project.end_date) && (
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>
                    {formatDate(project.start_date || "")} - {project.end_date ? formatDate(project.end_date) : "Present"}
                  </span>
                </div>
              )}
              
              {project.long_description && (
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <div 
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: renderFormattedText(project.long_description) }}
                  />
                </div>
              )}
              
              {/* Tags */}
              {project.tags && project.tags.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Technologies</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
} 