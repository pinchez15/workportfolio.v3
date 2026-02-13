"use client"

import Link from "next/link"
import { useState, useMemo } from "react"
import { SignUpButton } from "@clerk/nextjs"
import {
  Search,
  Briefcase,
  FolderOpen,
  Compass,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import type { ExploreUser } from "./page"

interface ExploreClientProps {
  users: ExploreUser[]
  isSignedIn: boolean
}

const CATEGORY_FILTERS = [
  "All",
  "Product",
  "Design",
  "Engineering",
  "Marketing",
  "Sales",
  "Data",
  "Operations",
]

function matchesCategory(user: ExploreUser, category: string): boolean {
  if (category === "All") return true

  const lowerCategory = category.toLowerCase()
  const titleMatch = user.title?.toLowerCase().includes(lowerCategory) || false
  const skillMatch = user.skills.some((s) =>
    s.toLowerCase().includes(lowerCategory)
  )

  // Broader matching for some categories
  if (lowerCategory === "engineering") {
    const engineeringTerms = ["engineer", "developer", "software", "frontend", "backend", "fullstack", "full-stack", "devops"]
    const titleEngMatch = engineeringTerms.some((t) => user.title?.toLowerCase().includes(t))
    const skillEngMatch = user.skills.some((s) =>
      engineeringTerms.some((t) => s.toLowerCase().includes(t))
    )
    return titleMatch || skillMatch || titleEngMatch || skillEngMatch
  }

  if (lowerCategory === "design") {
    const designTerms = ["design", "ux", "ui", "creative", "visual", "graphic"]
    const titleDesMatch = designTerms.some((t) => user.title?.toLowerCase().includes(t))
    const skillDesMatch = user.skills.some((s) =>
      designTerms.some((t) => s.toLowerCase().includes(t))
    )
    return titleMatch || skillMatch || titleDesMatch || skillDesMatch
  }

  if (lowerCategory === "product") {
    const productTerms = ["product", "pm", "program"]
    const titlePmMatch = productTerms.some((t) => user.title?.toLowerCase().includes(t))
    return titleMatch || skillMatch || titlePmMatch
  }

  if (lowerCategory === "data") {
    const dataTerms = ["data", "analytics", "analyst", "science", "ml", "machine learning"]
    const titleDataMatch = dataTerms.some((t) => user.title?.toLowerCase().includes(t))
    const skillDataMatch = user.skills.some((s) =>
      dataTerms.some((t) => s.toLowerCase().includes(t))
    )
    return titleMatch || skillMatch || titleDataMatch || skillDataMatch
  }

  return titleMatch || skillMatch
}

export function ExploreClient({ users, isSignedIn }: ExploreClientProps) {
  const [activeCategory, setActiveCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredUsers = useMemo(() => {
    let result = users

    // Category filter
    if (activeCategory !== "All") {
      result = result.filter((u) => matchesCategory(u, activeCategory))
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          (u.title?.toLowerCase().includes(q) || false) ||
          u.skills.some((s) => s.toLowerCase().includes(q))
      )
    }

    return result
  }, [users, activeCategory, searchQuery])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <Link
              href="/"
              className="text-lg font-semibold text-blue-600"
            >
              WorkPortfolio
            </Link>
            <div className="flex items-center space-x-3">
              {isSignedIn ? (
                <Link href="/dashboard">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-sm bg-transparent"
                  >
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <SignUpButton>
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
                  >
                    Sign Up
                  </Button>
                </SignUpButton>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Explore Portfolios
          </h1>
          <p className="text-gray-600">
            Discover professionals and their work
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-4">
          {CATEGORY_FILTERS.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or skill..."
            className="pl-10 bg-white"
          />
        </div>

        {/* User Cards Grid */}
        {filteredUsers.length === 0 ? (
          <div className="text-center py-16">
            <Compass className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No portfolios found.</p>
            <p className="text-sm text-gray-400">
              Try a different category or search term.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map((user) => (
              <Link key={user.id} href={`/${user.username}`}>
                <Card className="bg-white shadow-sm border-0 rounded-xl hover:shadow-md transition-all h-full cursor-pointer">
                  <CardContent className="p-5">
                    <div className="flex items-start space-x-3 mb-3">
                      {user.avatar_url ? (
                        <img
                          src={user.avatar_url}
                          alt={user.name}
                          className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {user.name}
                        </h3>
                        <p className="text-sm text-gray-600 truncate">
                          {user.title || "Professional"}
                        </p>
                      </div>
                    </div>

                    {/* Skills badges (top 3) */}
                    {user.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {user.skills.slice(0, 3).map((skill) => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            className="text-xs bg-gray-100 text-gray-700 border-0"
                          >
                            {skill}
                          </Badge>
                        ))}
                        {user.skills.length > 3 && (
                          <Badge
                            variant="secondary"
                            className="text-xs bg-gray-100 text-gray-500 border-0"
                          >
                            +{user.skills.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Bottom row */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center">
                        <FolderOpen className="w-3.5 h-3.5 mr-1" />
                        {user.project_count} project
                        {user.project_count !== 1 ? "s" : ""}
                      </span>
                      {user.available_for_hire && (
                        <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                          <Briefcase className="w-3 h-3 mr-1" />
                          Hiring
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
