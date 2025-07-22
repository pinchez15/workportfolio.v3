"use client"

import { useState } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface Project {
  title: string
  description: string
  image: string
  tags: string[]
  skills: string[]
  company?: string
  short_description?: string
  long_description?: string
  start_date?: string
  end_date?: string
  image_paths?: string[]
}

interface ProjectFilterProps {
  projects: Project[]
  skills: string[]
}

export function ProjectFilter({ projects, skills }: ProjectFilterProps) {
  const [selectedSkill, setSelectedSkill] = useState<string>("all")

  const filteredProjects = selectedSkill === "all" 
    ? projects 
    : projects.filter(project => project.skills.includes(selectedSkill))

  return (
    <div>
      <div className="mb-6">
        <h2 className="mb-4 text-2xl font-bold">Projects</h2>
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={selectedSkill === "all" ? "default" : "secondary"}
            className="cursor-pointer"
            onClick={() => setSelectedSkill("all")}
          >
            All
          </Badge>
          {skills.map((skill) => (
            <Badge
              key={skill}
              variant={selectedSkill === skill ? "default" : "secondary"}
              className="cursor-pointer"
              onClick={() => setSelectedSkill(skill)}
            >
              {skill}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {filteredProjects.map((project, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="relative h-48 w-full">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <CardContent className="p-6">
              <h3 className="mb-2 text-xl font-semibold">{project.title}</h3>
              <p className="mb-4 text-muted-foreground">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 