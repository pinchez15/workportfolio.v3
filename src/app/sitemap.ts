import type { MetadataRoute } from "next"
import { createClient } from "@supabase/supabase-js"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.workportfolio.io"

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/explore`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${baseUrl}/terms`, changeFrequency: "yearly", priority: 0.2 },
  ]

  // Dynamic portfolio pages
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) return staticPages

  const supabase = createClient(supabaseUrl, supabaseKey)

  const { data: users } = await supabase
    .from("users")
    .select("username, created_at")
    .not("name", "is", null)

  if (!users) return staticPages

  const portfolioPages: MetadataRoute.Sitemap = users.map((user) => ({
    url: `${baseUrl}/${user.username}`,
    lastModified: new Date(user.created_at),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }))

  return [...staticPages, ...portfolioPages]
}
