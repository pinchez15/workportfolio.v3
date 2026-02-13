import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { createClient } from "@supabase/supabase-js"
import { DashboardClient } from "./dashboard-client"

interface ProfileCompleteness {
  percentage: number
  missingFields: string[]
}

function computeProfileCompleteness(
  user: Record<string, unknown>,
  projectCount: number,
  linkCount: number
): ProfileCompleteness {
  const checks = [
    { field: "name", weight: 15, label: "Add your name" },
    { field: "title", weight: 15, label: "Add a professional title" },
    { field: "bio", weight: 15, label: "Write a short bio" },
    { field: "avatar_url", weight: 10, label: "Upload a profile photo" },
    { field: "contact_email", weight: 15, label: "Add a contact email" },
  ]

  let percentage = 0
  const missingFields: string[] = []

  for (const check of checks) {
    if (user[check.field]) {
      percentage += check.weight
    } else {
      missingFields.push(check.label)
    }
  }

  if (projectCount > 0) {
    percentage += 20
  } else {
    missingFields.push("Add your first project")
  }

  if (linkCount > 0) {
    percentage += 10
  } else {
    missingFields.push("Add a link")
  }

  return { percentage, missingFields }
}

export default async function DashboardPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/")
  }

  const user = await currentUser()
  if (!user) {
    redirect("/")
  }

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    redirect("/")
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  // Fetch user record
  const { data: dbUser, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single()

  if (userError || !dbUser) {
    redirect("/welcome-demo")
  }

  if (!dbUser.name) {
    redirect("/welcome-demo")
  }

  // Fetch ALL projects (including hidden) for the dashboard
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  // Fetch ALL links
  const { data: links } = await supabase
    .from("links")
    .select("*")
    .eq("user_id", userId)
    .order("order_index", { ascending: true })

  const allProjects = projects || []
  const allLinks = links || []

  // Collect unique skills across all projects
  const allSkills = Array.from(
    new Set(allProjects.flatMap((p) => p.skills || []))
  )

  const completeness = computeProfileCompleteness(
    dbUser,
    allProjects.length,
    allLinks.length
  )

  return (
    <DashboardClient
      user={dbUser}
      projects={allProjects}
      links={allLinks}
      skills={allSkills}
      completeness={completeness}
    />
  )
}
