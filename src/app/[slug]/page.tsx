import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ExternalLink, Github, Linkedin, Mail, Youtube, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/theme-toggle"
import { ProjectFilter } from "@/components/project-filter"
import { EditMode } from "@/components/portfolio/edit-mode"
import { ProjectCard } from "@/components/portfolio/project-card"
import { createServerComponentClient } from "@/lib/supabase"


interface PortfolioPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getPortfolioData(slug: string) {
  const supabase = createServerComponentClient();
  
  // Get user by username (slug)
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('username', slug)
    .single();

  if (userError || !user) {
    return null;
  }

  // Get user's projects
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id)
    .eq('visible', true)
    .order('created_at', { ascending: false });

  // Get user's links
  const { data: links } = await supabase
    .from('links')
    .select('*')
    .eq('user_id', user.id)
    .eq('visible', true)
    .order('created_at', { ascending: true });

  return {
    user,
    projects: projects || [],
    links: links || []
  };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = await getPortfolioData(slug);
  
  if (!data) {
    return { title: "User Not Found" };
  }

  const { user } = data;

  return {
    title: `${user.name || user.username} - WorkPortfolio`,
    description: user.bio || `Portfolio of ${user.name || user.username}`,
  };
}

export default async function PortfolioPage({ params }: PortfolioPageProps) {
  const { slug } = await params;
  const data = await getPortfolioData(slug);

  if (!data) {
    notFound();
  }

  const { user, projects, links } = data;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "ExternalLink":
        return <ExternalLink className="h-5 w-5" />
      case "Youtube":
        return <Youtube className="h-5 w-5" />
      case "Mail":
        return <Mail className="h-5 w-5" />
      default:
        return <ExternalLink className="h-5 w-5" />
    }
  }

  const backgrounds = [
    {
      id: "gradient-1",
      name: "Professional Blue",
      style: "bg-gradient-to-br from-blue-50 to-indigo-100",
      darkStyle: "dark:bg-gradient-to-br dark:from-gray-900 dark:to-blue-900",
    },
    {
      id: "gradient-2",
      name: "Soft Lavender",
      style: "bg-gradient-to-br from-purple-50 to-pink-100",
      darkStyle: "dark:bg-gradient-to-br dark:from-gray-900 dark:to-purple-900",
    },
    {
      id: "gradient-3",
      name: "Mint Fresh",
      style: "bg-gradient-to-br from-green-50 to-teal-100",
      darkStyle: "dark:bg-gradient-to-br dark:from-gray-900 dark:to-green-900",
    },
    {
      id: "gradient-4",
      name: "Warm Sunset",
      style: "bg-gradient-to-br from-orange-50 to-amber-100",
      darkStyle: "dark:bg-gradient-to-br dark:from-gray-900 dark:to-orange-900",
    },
    {
      id: "gradient-5",
      name: "Clean Slate",
      style: "bg-gradient-to-br from-gray-50 to-slate-100",
      darkStyle: "dark:bg-gradient-to-br dark:from-gray-900 dark:to-slate-800",
    },
  ]

  // For a real app, these would come from the user's settings in the database
  const userSettings = {
    background: "gradient-1",
    font: "inter",
    buttonStyle: "filled",
  }

  const fonts = [
    { id: "inter", name: "Inter", style: "font-sans" },
    { id: "georgia", name: "Georgia", style: "font-serif" },
    { id: "montserrat", name: "Montserrat", style: "font-sans" },
    { id: "merriweather", name: "Merriweather", style: "font-serif" },
    { id: "roboto", name: "Roboto", style: "font-sans" },
  ]

  // Transform projects for the ProjectFilter component
  const transformedProjects = projects.map(project => ({
    title: project.title,
    description: project.short_description || '',
    image: project.image_path || '/placeholder.svg?height=200&width=400',
    tags: project.tags || [],
    skills: project.skills || []
  }));

  // Get unique skills from all projects
  const allSkills = Array.from(new Set(
    transformedProjects.flatMap(project => project.skills)
  ));

  // Transform links for display
  const transformedLinks = links.map(link => ({
    title: link.title,
    url: link.url,
    description: link.description || '',
    icon: link.icon || 'ExternalLink'
  }));

  return (
    <EditMode userId={user.id} initialData={{ user, projects, links }}>
      <div
        className={`min-h-screen ${backgrounds.find((bg) => bg.id === userSettings.background)?.style || ""} ${
          fonts.find((f) => f.id === userSettings.font)?.style || "font-sans"
        }`}
      >
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-xl font-bold text-primary">
            WorkPortfolio
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/register" className="hidden sm:block">
              <Button size="sm" variant="outline">
                Create Your Portfolio
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pb-20 pt-8">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="relative h-24 w-24 overflow-hidden rounded-full">
              <Image
                src={user.avatar_url || "/placeholder.svg?height=100&width=100"}
                alt={user.name || user.username}
                fill
                className="object-cover"
                sizes="96px"
                priority
              />
            </div>
            <h1 className="mt-4 text-3xl font-bold">{user.name || user.username}</h1>
            <p className="text-primary">{user.title}</p>
            <p className="mt-2 max-w-lg text-muted-foreground">{user.bio}</p>

            <div className="mt-4 flex gap-2">
              {user.social_links?.linkedin && (
                <Link href={user.social_links.linkedin} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="icon">
                    <Linkedin className="h-5 w-5" />
                    <span className="sr-only">LinkedIn</span>
                  </Button>
                </Link>
              )}
              {user.social_links?.github && (
                <Link href={user.social_links.github} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="icon">
                    <Github className="h-5 w-5" />
                    <span className="sr-only">GitHub</span>
                  </Button>
                </Link>
              )}
            </div>
          </div>

          <Separator className="my-8" />

          {transformedLinks.length > 0 && (
            <section className="mt-8">
              <h2 className="mb-4 text-2xl font-bold">Links</h2>
              <div className="flex flex-col gap-3">
                {transformedLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-transform hover:scale-[1.01]"
                  >
                    <Card>
                      <CardContent className="flex items-center gap-4 p-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                          {getIcon(link.icon)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{link.title}</h3>
                          {link.description && <p className="text-sm text-muted-foreground">{link.description}</p>}
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      </CardContent>
                    </Card>
                  </a>
                ))}
              </div>
            </section>
          )}

          {transformedProjects.length > 0 && (
            <section className="mt-12">
              <ProjectFilter projects={transformedProjects} skills={allSkills} />
            </section>
          )}

          {/* Enhanced Project Cards */}
          {projects.length > 0 && (
            <section className="mt-12">
              <h2 className="mb-6 text-2xl font-bold">Projects</h2>
              <div className="grid gap-6 md:grid-cols-2">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <div className="border-t bg-muted/30 py-6">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
              <div>
                <p className="text-sm text-muted-foreground">
                  Created with{" "}
                  <Link href="/" className="font-medium text-primary hover:underline">
                    WorkPortfolio.io
                  </Link>
                </p>
              </div>
              <Link href="/register">
                <Button size="sm" className="gap-1">
                  Create Your Portfolio <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
    </EditMode>
  )
} 