import { ArrowRight, Check, FolderOpen, Briefcase } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs"
import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { createClient } from "@supabase/supabase-js"

export default async function HomePage() {
  console.log('🏠 Homepage accessed at:', new Date().toISOString());

  // Check if user is authenticated and redirect to dashboard
  const { userId } = await auth();
  console.log('🔐 Auth check - userId:', userId);

  if (userId) {
    const user = await currentUser();

    if (!user) {
      redirect('/sign-in');
    }

    // Check if user exists in Supabase
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    console.log('🔧 Environment check:', {
      supabaseUrl: supabaseUrl ? '✅ Set' : '❌ Missing',
      supabaseKey: supabaseKey ? '✅ Set' : '❌ Missing'
    });

    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Missing Supabase environment variables - redirecting to welcome');
      // If we can't check the database, assume user needs onboarding
      redirect('/welcome-demo');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('📋 Checking if user exists in Supabase for userId:', userId);

    const { data: existingUser, error } = await supabase
      .from('users')
      .select('id, username, name')
      .eq('id', userId)
      .single();

    console.log('📊 Database check result:', { existingUser, error });

    if (existingUser) {
      // User exists in database - check if they've completed onboarding
      if (!existingUser.name) {
        // User was created by webhook but hasn't filled in their profile yet
        console.log('🆕 User exists but has no name - redirecting to onboarding');
        redirect('/welcome-demo');
      }
      // User has completed onboarding, redirect to dashboard
      console.log(`✅ User exists with profile - redirecting to dashboard`);
      redirect(`/dashboard`);
    } else {
      // User doesn't exist in database, redirect to welcome page
      console.log('🆕 User not found in database - redirecting to welcome');
      redirect('/welcome-demo');
    }
  }

  // Fetch explore users for the landing page preview
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  let exploreUsers: {
    id: string
    username: string
    name: string
    title?: string
    avatar_url?: string
    available_for_hire?: boolean
    skills: string[]
    project_count: number
  }[] = []

  if (supabaseUrl && supabaseKey) {
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data: users } = await supabase
      .from("users")
      .select("id, username, name, title, avatar_url, available_for_hire")
      .not("name", "is", null)
      .order("created_at", { ascending: false })

    if (users && users.length > 0) {
      const userIds = users.map((u) => u.id)
      const { data: projects } = await supabase
        .from("projects")
        .select("user_id, skills, visible")
        .in("user_id", userIds)
        .eq("visible", true)

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

      exploreUsers = users
        .filter((u) => (projectCountMap[u.id] || 0) > 0)
        .slice(0, 6)
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
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-xl font-bold text-blue-600">
                WorkPortfolio
              </Link>
              <nav className="hidden md:flex space-x-8">
                <Link href="/explore" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Explore
                </Link>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <SignedOut>
                <SignInButton>
                  <Button variant="ghost" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Sign in
                  </Button>
                </SignInButton>
                <SignUpButton>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-xl transition-all duration-200">
                    Sign Up
                  </Button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="space-y-6 mb-8">
            <Badge
              variant="secondary"
              className="bg-blue-100 text-blue-700 border-blue-200 px-4 py-2 text-sm font-medium"
            >
              FOR PROFESSIONALS WHO MOVE FAST
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.1] tracking-tight">
              Don&apos;t tell. <span className="text-blue-600">Show.</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 leading-relaxed">
              You do great work. You just need a simple, beautiful way to show it off.
            </p>
          </div>

          {/* Benefits List */}
          <div className="space-y-3 mb-8 inline-block text-left">
            {[
              "Portfolios live in under 5 minutes",
              "No domains. No design decisions.",
              "Perfect for LinkedIn, resumes, cold outreach",
            ].map((benefit, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                  <Check className="w-4 h-4 text-green-500" />
                </div>
                <span className="text-lg text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <SignUpButton>
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-base"
              >
                Create Your Free Portfolio
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </SignUpButton>
            <Link href="https://www.workportfolio.io/nate_pinches" target="_blank" rel="noopener noreferrer">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-gray-300 text-gray-700 font-semibold px-8 py-4 rounded-xl hover:bg-gray-50 transition-all duration-200 text-base bg-transparent"
              >
                View Live Example
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Explore Preview Section */}
      {exploreUsers.length > 0 && (
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  See what others are building
                </h2>
                <p className="text-gray-600 mt-1">
                  Real portfolios from real professionals
                </p>
              </div>
              <Link
                href="/explore"
                className="hidden sm:flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                View all
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {exploreUsers.map((user) => (
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

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center">
                          <FolderOpen className="w-3.5 h-3.5 mr-1" />
                          {user.project_count} project
                          {user.project_count !== 1 ? "s" : ""}
                        </span>
                        {user.available_for_hire && (
                          <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                            <Briefcase className="w-3 h-3 mr-1" />
                            Available
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link
                href="/explore"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Explore all portfolios
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Simple CTA Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            Ready to show your work?
          </h2>
          <SignUpButton>
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-base"
            >
              Sign Up Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </SignUpButton>
          <p className="text-gray-500 mt-4 text-sm">
            Free forever. Live in 5 minutes.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 lg:gap-12">
            <div>
              <h3 className="font-bold text-gray-900 mb-6 text-lg">WorkPortfolio</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Work Portfolios to show your work and advance your career.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-6">Product</h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li>
                  <Link href="/explore" className="hover:text-gray-900 transition-colors">
                    Explore
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-6">Company</h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li>
                  <Link href="#" className="hover:text-gray-900 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-gray-900 transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-6">Connect</h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li>
                  <Link href="#" className="hover:text-gray-900 transition-colors">
                    LinkedIn
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-12 pt-8 text-center">
            <p className="text-sm text-gray-500">
              © 2025 WorkPortfolio. Product of CappaWork LLC. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
