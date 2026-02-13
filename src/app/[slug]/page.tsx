import { notFound } from "next/navigation"
import { createClient } from "@supabase/supabase-js"
import { PortfolioClient } from "./portfolio-client"
import type { Metadata } from "next"

interface PortfolioPageProps {
  params: Promise<{
    slug: string
  }>
}

function getSupabase() {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !supabaseKey) return null
  return createClient(supabaseUrl, supabaseKey)
}

export async function generateMetadata({ params }: PortfolioPageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = getSupabase()
  if (!supabase) return {}

  const { data: user } = await supabase
    .from("users")
    .select("name, title, bio, avatar_url, username")
    .eq("username", slug)
    .single()

  if (!user) return { title: "Portfolio Not Found" }

  const title = user.name || slug
  const description = user.bio
    || (user.title ? `${user.title} — View ${user.name}'s portfolio` : `View ${user.name}'s professional portfolio`)
  const url = `https://www.workportfolio.io/${user.username}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: "profile",
      ...(user.avatar_url ? { images: [{ url: user.avatar_url, width: 400, height: 400 }] } : {}),
    },
    twitter: {
      card: "summary",
      title,
      description,
      ...(user.avatar_url ? { images: [user.avatar_url] } : {}),
    },
    alternates: {
      canonical: url,
    },
  }
}

export default async function PortfolioPage({ params }: PortfolioPageProps) {
  const { slug } = await params

  const supabase = getSupabase()
  if (!supabase) {
    console.error('Missing Supabase environment variables in portfolio page')
    notFound()
  }

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

  // No portfolio table needed - use user data directly
  const portfolio = {
    id: user.id,
    user_id: user.id,
    title: `${user.name || user.username}'s Portfolio`,
    slug: user.username,
    bio: user.bio,
    calendly_url: user.calendly_url || undefined,
    created_at: user.created_at
  }

  // Fetch projects
  const { data: projects, error: projectsError } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", user.id)
    .eq("visible", true)
    .order("order_index", { ascending: true })

  if (projectsError) {
    console.error("Error fetching projects:", projectsError)
  }

  // Fetch links
  const { data: links, error: linksError } = await supabase
    .from("links")
    .select("*")
    .eq("user_id", user.id)
    .eq("visible", true)
    .order("order_index", { ascending: true })

  if (linksError) {
    console.error("Error fetching links:", linksError)
  }

  // Get all unique skills from projects for filtering
  const allSkills = Array.from(
    new Set(
      (projects || []).flatMap((project) => project.skills || [])
    )
  ).sort()

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: user.name,
      url: `https://www.workportfolio.io/${user.username}`,
      ...(user.title ? { jobTitle: user.title } : {}),
      ...(user.bio ? { description: user.bio } : {}),
      ...(user.avatar_url ? { image: user.avatar_url } : {}),
      ...(allSkills.length > 0 ? { knowsAbout: allSkills } : {}),
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PortfolioClient
        user={user}
        portfolio={portfolio}
        projects={projects || []}
        links={links || []}
        allSkills={allSkills}
      />
    </>
  )
}