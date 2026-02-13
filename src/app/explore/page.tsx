import { auth } from "@clerk/nextjs/server"
import { createClient } from "@supabase/supabase-js"
import { ExploreClient } from "./explore-client"

export interface ExploreUser {
  id: string
  username: string
  name: string
  title?: string
  avatar_url?: string
  available_for_hire?: boolean
  skills: string[]
  project_count: number
}

export default async function ExplorePage() {
  const { userId } = await auth()

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Unable to load explore page.</p>
      </div>
    )
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  // Fetch users who have a name (completed onboarding)
  const { data: users } = await supabase
    .from("users")
    .select("id, username, name, title, avatar_url, available_for_hire")
    .not("name", "is", null)
    .order("created_at", { ascending: false })

  if (!users || users.length === 0) {
    return (
      <ExploreClient users={[]} isSignedIn={!!userId} />
    )
  }

  // Fetch visible projects for all users to get counts and skills
  const userIds = users.map((u) => u.id)
  const { data: projects } = await supabase
    .from("projects")
    .select("user_id, skills, visible")
    .in("user_id", userIds)
    .eq("visible", true)

  // Build per-user project counts and skills
  const projectCountMap: Record<string, number> = {}
  const skillsMap: Record<string, Set<string>> = {}

  for (const project of projects || []) {
    projectCountMap[project.user_id] = (projectCountMap[project.user_id] || 0) + 1
    if (project.skills) {
      if (!skillsMap[project.user_id]) {
        skillsMap[project.user_id] = new Set()
      }
      for (const skill of project.skills) {
        skillsMap[project.user_id].add(skill)
      }
    }
  }

  // Only include users with at least 1 visible project
  const exploreUsers: ExploreUser[] = users
    .filter((u) => (projectCountMap[u.id] || 0) > 0)
    .map((u) => ({
      id: u.id,
      username: u.username,
      name: u.name,
      title: u.title || undefined,
      avatar_url: u.avatar_url || undefined,
      available_for_hire: u.available_for_hire || false,
      skills: Array.from(skillsMap[u.id] || []),
      project_count: projectCountMap[u.id] || 0,
    }))

  return <ExploreClient users={exploreUsers} isSignedIn={!!userId} />
}
