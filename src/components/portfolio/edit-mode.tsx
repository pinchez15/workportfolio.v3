"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { Edit, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HeaderEditor } from "./header-editor"
import { LinksEditor } from "./links-editor"
import { ProjectsEditor } from "./projects-editor"

import { User, Project, Link as UserLink } from "@/types/database"

interface EditModeProps {
  children: React.ReactNode
  userId: string
  initialData: {
    user: User
    projects: Project[]
    links: UserLink[]
  }
}

export function EditMode({ children, userId, initialData }: EditModeProps) {
  const { user } = useUser()
  const [isEditMode, setIsEditMode] = useState(false)
  const [data, setData] = useState(initialData)

  // Only show edit button if user is logged in and viewing their own portfolio
  const isOwnPortfolio = user?.id === userId

  if (!isOwnPortfolio) {
    return <>{children}</>
  }

  return (
    <div className={`relative ${isEditMode ? 'edit-mode-active' : ''}`}>
      {children}
      
      {/* Edit Mode Overlay */}
      {isEditMode && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50">
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl">
                <div className="flex items-center justify-between p-6 border-b">
                  <h2 className="text-2xl font-bold">Edit Portfolio</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsEditMode(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                
                <div className="p-6 space-y-8">
                  <HeaderEditor 
                    user={data.user} 
                    onUpdate={(updatedUser: User) => setData(prev => ({ ...prev, user: updatedUser }))}
                  />
                  
                  <LinksEditor 
                    links={data.links}
                    onUpdate={(updatedLinks: UserLink[]) => setData(prev => ({ ...prev, links: updatedLinks }))}
                  />
                  
                  <ProjectsEditor 
                    projects={data.projects}
                    onUpdate={(updatedProjects: Project[]) => setData(prev => ({ ...prev, projects: updatedProjects }))}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Edit Button */}
      <Button
        onClick={() => setIsEditMode(true)}
        className="fixed bottom-6 right-6 z-40 shadow-lg"
        size="lg"
      >
        <Edit className="h-5 w-5 mr-2" />
        Edit Portfolio
      </Button>
    </div>
  )
} 