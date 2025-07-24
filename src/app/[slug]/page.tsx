import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { PortfolioClient } from "./portfolio-client"

interface PortfolioPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function PortfolioPage({ params }: PortfolioPageProps) {
  const { slug } = await params
  const cookieStore = await cookies()
  const supabase = await createClient(cookieStore)

  // Fetch portfolio data by slug
  const { data: portfolio, error: portfolioError } = await supabase
    .from("portfolios")
    .select("*")
    .eq("slug", slug)
    .single()

  if (portfolioError || !portfolio) {
    notFound()
  }

  // Fetch user data
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", portfolio.user_id)
    .single()

  if (userError || !user) {
    notFound()
  }

  // Fetch projects
  const { data: projects, error: projectsError } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", portfolio.user_id)
    .eq("visible", true)
    .order("created_at", { ascending: false })

  if (projectsError) {
    console.error("Error fetching projects:", projectsError)
  }

  // Fetch links
  const { data: links, error: linksError } = await supabase
    .from("links")
    .select("*")
    .eq("user_id", portfolio.user_id)
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