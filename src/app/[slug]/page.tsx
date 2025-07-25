import { notFound } from "next/navigation"
import { createClient } from "@supabase/supabase-js"
import { PortfolioClient } from "./portfolio-client"

interface PortfolioPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function PortfolioPage({ params }: PortfolioPageProps) {
  const { slug } = await params
  
  // Create Supabase client with environment variable validation
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables in portfolio page')
    notFound()
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  // Fetch user data by username (slug)
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("username", slug)
    .single()

  if (userError || !user) {
    console.error("User not found for username:", slug, userError)
    notFound()
  }

  // Create a mock portfolio since we don't have portfolios table data yet
  const portfolio = {
    id: "mock-portfolio",
    user_id: user.id,
    title: `${user.name || user.username}'s Portfolio`,
    slug: user.username,
    bio: user.bio,
    calendly_url: null,
    show_links: true,
    created_at: user.created_at
  }

  // Fetch projects
  const { data: projects, error: projectsError } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", user.id)
    .eq("visible", true)
    .order("created_at", { ascending: false })

  if (projectsError) {
    console.error("Error fetching projects:", projectsError)
  }

  // Fetch links
  const { data: links, error: linksError } = await supabase
    .from("links")
    .select("*")
    .eq("user_id", user.id)
    .eq("visible", true)
    .order("created_at", { ascending: false })

  if (linksError) {
    console.error("Error fetching links:", linksError)
  }

  // Get all unique skills from projects for filtering
  const allSkills = Array.from(
    new Set(
      (projects || []).flatMap((project) => project.skills || [])
    )
  ).sort()

  return (
    <PortfolioClient
      user={user}
      portfolio={portfolio}
      projects={projects || []}
      links={links || []}
      allSkills={allSkills}
    />
  )
}