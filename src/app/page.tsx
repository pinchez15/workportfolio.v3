import { ArrowRight, Check, Upload, Star, Zap } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs"
import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { createClient } from "@supabase/supabase-js"
import { generateUsername } from "@/lib/username"

export default async function HomePage() {
  // Check if user is authenticated and redirect to their portfolio
  const { userId } = await auth();
  
  if (userId) {
    const user = await currentUser();
    
    if (!user) {
      // User is authenticated but we can't get user data, redirect to sign-in
      redirect('/sign-in');
    }
    
    // Generate username using consistent logic
    const username = generateUsername({
      first_name: user.firstName,
      last_name: user.lastName,
      username: user.username,
      emailAddresses: user.emailAddresses,
      id: userId
    });
    
    // Check if user exists in Supabase
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase environment variables');
      // If we can't check the database, assume user needs onboarding
      redirect('/welcome-demo');
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single();
    
    if (existingUser) {
      // User exists in database, redirect to their portfolio
      redirect(`/${username}`);
    } else {
      // User doesn't exist in database, redirect to welcome page
      redirect('/welcome-demo');
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
                <Link href="#" className="text-blue-600 font-medium hover:text-blue-700 transition-colors">
                  Home
                </Link>
                <Link href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Features
                </Link>
                <Link href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Pricing
                </Link>
              </nav>
            </div>
            
            {/* Clerk Authentication Buttons */}
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
      <section className="relative py-16 sm:py-20 lg:py-24 xl:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 items-center">
            {/* Left Content */}
            <div className="space-y-8 lg:space-y-10">
              <div className="space-y-6">
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-700 border-blue-200 px-4 py-2 text-sm font-medium"
                >
                  FOR PROFESSIONALS WHO MOVE FAST
                </Badge>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-[1.1] tracking-tight">
                  Don&apos;t tell. <span className="text-blue-600">Show.</span>
                </h1>
                <p className="text-xl sm:text-2xl text-gray-600 leading-relaxed max-w-2xl">
                  You do great work. You just need a simple, beautiful way to show it off.
                </p>
              </div>

              {/* Benefits List */}
              <div className="space-y-4">
                {[
                  "Portfolios live in under 5 minutes",
                  "No domains. No design decisions.",
                  "Perfect for LinkedIn, resumes, cold outreach",
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                      <Check className="w-4 h-4 text-green-500" />
                    </div>
                    <span className="text-lg text-gray-700 leading-relaxed">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <SignUpButton>
                  <Button
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-base"
                  >
                    Create Your Free Portfolio
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </SignUpButton>
                <Link href="https://www.workportfolio.io/natepinches" target="_blank" rel="noopener noreferrer">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-gray-300 text-gray-700 font-semibold px-8 py-4 rounded-xl hover:bg-gray-50 transition-all duration-200 text-base bg-transparent"
                  >
                    View Live Example
                  </Button>
                </Link>
              </div>

              {/* Social Proof */}
              <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-8 pt-4">
                <div className="flex items-center space-x-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 bg-blue-600 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-medium"
                      >
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">Join 2,000+ professionals</span>
                </div>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">4.9/5</span>
                </div>
              </div>
            </div>

            {/* Right Content - Portfolio Preview */}
            <div className="relative mt-8 lg:mt-0">
              <div className="relative z-10">
                <Card className="bg-white shadow-2xl rounded-2xl border-0 overflow-hidden">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                          S
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">Sarah Miller</h3>
                          <p className="text-gray-600 mt-1">Product Designer</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800 border-green-200 font-medium">LIVE</Badge>
                    </div>

                    <p className="text-gray-500 text-sm mb-8 font-mono">workportfolio.io/sarah</p>

                    <div className="space-y-6">
                      <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg"></div>
                            <div>
                              <p className="font-semibold text-gray-900 mb-1">E-commerce Redesign</p>
                              <p className="text-sm text-gray-600">Increased conversion by 34%</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                            LIVE
                          </Button>
                        </div>
                      </div>

                      <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-green-500 rounded-lg"></div>
                            <div>
                              <p className="font-semibold text-gray-900 mb-1">Mobile App MVP</p>
                              <p className="text-sm text-gray-600">0 to 10k users in 3 months</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="text-green-500 hover:text-green-600">
                            VIEW
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100">
                      <p className="text-xs text-gray-500 flex items-center">
                        <Zap className="w-3 h-3 mr-2" />
                        Built in 4 minutes
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Background decoration */}
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-4 -left-4 w-48 h-48 bg-gray-400/10 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 items-start">
            <div className="space-y-10">
              <div className="space-y-6">
                <Badge
                  variant="destructive"
                  className="bg-red-100 text-red-500 border-red-200 px-4 py-2 text-sm font-medium"
                >
                  THE PROBLEM
                </Badge>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-[1.2] tracking-tight">
                  Traditional platforms make it <span className="text-red-500 italic">way too hard</span>
                </h2>
              </div>

              <Card className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden">
                <CardHeader className="bg-red-50 border-b border-red-100 p-6">
                  <CardTitle className="text-gray-900 text-xl">The Old Way: Hours of Setup</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {[
                    { text: "Buy domain ($15/year)", time: "2 hrs" },
                    { text: "Choose hosting ($10/month)", time: "1 hr" },
                    { text: "Design layout", time: "6+ hours" },
                    { text: "Write content", time: "3+ hours" },
                    { text: "Hope it works on mobile", time: "🥴" },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
                    >
                      <span className="text-gray-700 text-base">{item.text}</span>
                      {item.time && <span className="text-red-500 font-medium text-base">{item.time}</span>}
                    </div>
                  ))}
                  <div className="pt-6 mt-6 border-t border-gray-200">
                    <div className="bg-red-50 p-6 rounded-xl text-center border border-red-100">
                      <span className="font-bold text-red-500 text-lg">Total: 13+ hours, $120+/year</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-10 lg:pt-48">
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">Website builders take forever</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    Website builders like Wix take too long. You need a domain, theme, and time you don&apos;t have.
                    Most professionals give up halfway through or launch something that looks amateur.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">Your work gets buried in text</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    LinkedIn posts get lost in feeds. Resumes hide your best work in bullet points. Email signatures
                    can&apos;t show screenshots. You&apos;re tired of <em>describing</em> what you&apos;ve built.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                    Good work should speak for itself
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-lg mb-8">
                    If your work speaks for itself, <em>why is it so hard to show it?</em> You shouldn&apos;t need to be
                    a web designer to showcase your actual skills.
                  </p>
                  <div className="border-l-4 border-red-500 pl-8 bg-red-50 p-8 rounded-r-xl">
                    <p className="font-bold text-gray-900 mb-3 text-lg leading-tight">
                      Don&apos;t let your best work get lost in resumes and long bios.
                    </p>
                    <p className="text-gray-700 text-lg">Stop explaining—start showing.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-20 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 items-center">
            <div>
              <Card className="bg-white shadow-xl border-0 rounded-2xl overflow-hidden">
                <CardHeader className="bg-blue-50 border-b border-blue-100 p-6">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-gray-900 text-xl">Add a Project</CardTitle>
                    <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Takes 2 min</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-8 space-y-8 my-0">
                  <div className="space-y-3">
                    <Label htmlFor="title" className="text-gray-700 font-medium text-base">
                      Project Title
                    </Label>
                    <Input
                      id="title"
                      placeholder="E-commerce Redesign"
                      className="border-gray-200 focus:border-blue-600 h-12"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="achievement" className="text-gray-700 font-medium text-base">
                      What you achieved
                    </Label>
                    <Textarea
                      id="achievement"
                      placeholder="Increased conversion by 34%..."
                      className="border-gray-200 focus:border-blue-600 min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-gray-700 font-medium text-base">Screenshot or Demo</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-600 transition-colors">
                      <Upload className="w-8 h-8 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-500 font-medium">Drag & Drop</p>
                    </div>
                  </div>

                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl text-base">
                    Publish Project ✨
                  </Button>
                </CardContent>
              </Card>
              <p className="text-center mt-8 text-gray-600 text-lg">
                That&apos;s it. <span className="text-green-500 font-semibold">Live in under 5 minutes.</span>
              </p>
            </div>

            <div className="space-y-10">
              <div className="space-y-6 my-0">
                <Badge className="bg-blue-100 text-blue-700 border-blue-200 px-4 py-2 text-sm font-medium">
                  WE GET IT
                </Badge>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-[1.2] tracking-tight">
                  We&apos;ve been there
                </h2>
              </div>

              <div className="space-y-8 text-gray-600 leading-relaxed">
                <p className="text-lg">
                  We&apos;ve built the all-day websites. We&apos;ve scrolled endlessly through LinkedIn trying to
                  explain projects with bullet points.
                </p>
                <p className="text-lg">
                  We&apos;ve pitched clients with 20-slide decks when a single screenshot would have closed the deal.
                </p>
              </div>

              <div className="p-8 border-l-4 border-blue-600 bg-blue-50 rounded-r-xl">
                <h3 className="font-bold text-gray-900 mb-4 text-lg">That&apos;s why we created WorkPortfolio</h3>
                <p className="text-gray-700 mb-6 leading-relaxed text-base">
                  A tool made <em>only</em> for showcasing your work. Fast, visual, and designed to help you look
                  professional—without the learning curve.
                </p>
                <div className="flex items-center text-blue-600 font-medium">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  Built by professionals, for professionals
                </div>
              </div>

              <div className="space-y-8">
                {[
                  {
                    title: "No technical skills needed",
                    description: "If you can post on LinkedIn, you can build a portfolio",
                  },
                  {
                    title: "Visual-first approach",
                    description: "Show screenshots, demos, and results—not just descriptions",
                  },
                  {
                    title: "Professional by default",
                    description: "Clean, modern design that makes your work shine",
                  },
                ].map((feature, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mt-1">
                      <Check className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-2 text-lg">{feature.title}</p>
                      <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 lg:mb-20">
            <Badge className="bg-blue-100 text-blue-700 border-blue-200 px-4 py-2 text-sm font-medium mb-6">
              SIMPLE PROCESS
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-[1.2] tracking-tight">
              How It Works
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Create your professional portfolio in minutes, not hours
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12 mb-16">
            {[
              {
                step: "1",
                title: "Sign Up",
                description: "Sign in with your LinkedIn account or email. No credit card required.",
                icon: "🔐",
                detail: "Sign in securely with LinkedIn or email",
              },
              {
                step: "2",
                title: "Create Projects",
                description: "Add your projects and links, as simply as posting on LinkedIn.",
                icon: "📸",
                detail: "Upload screenshots, add links, write results",
              },
              {
                step: "3",
                title: "Share Anywhere",
                description: "Share your portfolio with potential clients, employers, or investors.",
                icon: "🔗",
                detail: "workportfolio.io/yourname",
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="text-center bg-white shadow-lg border-0 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <CardContent className="pt-10 pb-10 px-8">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-8 shadow-lg">
                    {item.step}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                  <p className="text-gray-600 mb-8 leading-relaxed text-lg">{item.description}</p>
                  <div className="flex items-center justify-center text-blue-600 text-sm font-medium">
                    <span className="mr-2 text-lg">{item.icon}</span>
                    {item.detail}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <div className="inline-block bg-green-100 text-green-800 px-8 py-4 rounded-full text-sm font-semibold mb-8 border border-green-200">
              Average time: 4 minutes
            </div>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              That&apos;s it. No domains, no themes, no excuses.
            </p>
            <SignUpButton>
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-base"
              >
                Start Building Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </SignUpButton>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 sm:py-20 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-[1.2] tracking-tight">
              Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {"No custom domains or advanced themes—\nWorkPortfolio is built for speed, not complexity."}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-4xl mx-auto">
            <Card className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
              <CardHeader className="text-center bg-gray-50 border-b border-gray-200 p-8 flex-shrink-0 relative min-h-[140px] flex flex-col justify-center">
                <div className="h-8"></div> {/* Spacer to match Pro card badge space */}
                <CardTitle className="text-2xl text-gray-900 mb-4">Free Plan</CardTitle>
                <div className="text-4xl font-bold text-gray-900 mb-2">Free</div>
                <CardDescription className="text-gray-600 text-base">What's Included</CardDescription>
              </CardHeader>
              <CardContent className="p-8 flex-1 flex flex-col">
                <div className="space-y-6 flex-1">
                  {[
                    "One simple theme",
                    "Up to 4 projects",
                    "A clean, personal portfolio link",
                    "Quick, distraction-free layout",
                    "No setup, no learning curve, no cost",
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-4 flex-shrink-0" />
                      <span className="text-gray-700 text-base">{feature}</span>
                    </div>
                  ))}
                </div>
                <SignUpButton>
                  <Button
                    variant="outline"
                    className="w-full mt-8 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl py-4 text-base font-medium bg-transparent"
                  >
                    Create Your Free Portfolio
                  </Button>
                </SignUpButton>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-xl border-2 border-blue-200 rounded-2xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 relative flex flex-col">
              <CardHeader className="text-center bg-blue-50 border-b border-blue-200 p-8 flex-shrink-0 relative min-h-[140px] flex flex-col justify-center">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge variant="secondary" className="text-white border-0 px-6 py-2 text-sm font-medium mr-0 mb-0 mt-10 bg-yellow-500">Most Popular</Badge>
                </div>
                <div className="h-8"></div> {/* Spacer for badge */}
                <CardTitle className="text-2xl text-gray-900 mb-4">Pro</CardTitle>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  $8 <span className="text-lg font-normal text-gray-600">/month</span>
                </div>
                <p className="text-sm text-gray-600">or $50/year</p>
              </CardHeader>
              <CardContent className="p-8 flex-1 flex flex-col">
                <div className="space-y-6 flex-1">
                  {["Unlimited projects", "Priority support", "CTA buttons", "Vote on new features"].map(
                    (feature, index) => (
                      <div key={index} className="flex items-center">
                        <Check className="w-5 h-5 text-green-500 mr-4 flex-shrink-0" />
                        <span className="text-gray-700 text-base">{feature}</span>
                      </div>
                    ),
                  )}
                </div>
                <SignUpButton>
                  <Button className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl py-4 text-base shadow-xl">
                    Upgrade to Pro
                  </Button>
                </SignUpButton>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-gray-900 mb-16 lg:mb-20 leading-[1.2] tracking-tight">
            What Users Say
          </h2>
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-4xl mx-auto">
            {[
              {
                quote:
                  "I built my portfolio in less than 10 minutes. Now I can finally show my work instead of just talking about it.",
                name: "Rachel K.",
                role: "Product Manager",
                initials: "RK",
              },
              {
                quote: "I spent hours trying to build a website before this. WorkPortfolio just works.",
                name: "Tom A.",
                role: "Developer",
                initials: "TA",
              },
            ].map((testimonial, index) => (
              <Card
                key={index}
                className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <CardContent className="p-8 lg:p-10">
                  <p className="text-gray-700 mb-8 leading-relaxed text-lg">&quot;{testimonial.quote}&quot;</p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                      {testimonial.initials}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-base">{testimonial.name}</p>
                      <p className="text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-blue-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 items-center">
            <div className="space-y-10">
              <div className="space-y-6">
                <Badge className="bg-blue-500/20 text-blue-100 border-blue-400/30 px-4 py-2 text-sm font-medium">
                  YOUR SUCCESS
                </Badge>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-[1.1] tracking-tight">
                  Everyone has great AI-written resumes. <span className="text-yellow-400">Proof matters.</span>
                </h2>
              </div>

              <p className="text-xl text-blue-100 leading-relaxed">
                Stop explaining—<em>start showing</em>. AI wrote their résumé, but you wrote the code, built the app,
                launched the brand. Show it.
              </p>

              <div className="space-y-4">
                {[
                  "You look professional and credible",
                  "You stand out from the crowd",
                  "You land opportunities faster",
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <Check className="w-5 h-5 text-green-400 mr-4 flex-shrink-0" />
                    <span className="text-blue-100 text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              <Card className="bg-white text-gray-900 shadow-2xl border-0 rounded-2xl overflow-hidden">
                <CardContent className="p-8 lg:p-10">
                  <h3 className="text-2xl font-bold mb-4">Ready to show your work?</h3>
                  <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                    Join professionals who&apos;ve ditched lengthy explanations for visual proof.
                  </p>
                                  <SignUpButton>
                  <Button
                    size="lg"
                    className="w-full bg-blue-600 hover:bg-blue-700 mb-8 rounded-xl py-4 font-semibold text-base"
                  >
                    Create Your Free Portfolio
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </SignUpButton>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-500">
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                      Free forever
                    </span>
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Live in 5 minutes
                    </span>
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                      No credit card
                    </span>
                  </div>
                </CardContent>
              </Card>

              <div className="p-8 rounded-2xl border border-blue-600/50 px-8 bg-slate-800">
                <p className="text-blue-100 italic mb-6 leading-relaxed text-lg">
                  &quot;Finally, a portfolio that took 5 minutes, not 5 hours. I shared it the same day and booked two
                  calls.&quot;
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                    S
                  </div>
                  <div>
                    <p className="font-semibold text-white">Sarah Chen</p>
                    <p className="text-blue-200">Product Designer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
                  <Link href="#" className="hover:text-gray-900 transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-gray-900 transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-gray-900 transition-colors">
                    Blog
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

        {/* Fixed CTA Button */}
        <div className="fixed bottom-6 right-6 z-50">
          <SignUpButton>
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-200 rounded-xl px-6 py-3"
            >
              Create Your Free Portfolio
            </Button>
          </SignUpButton>
        </div>
      </footer>
    </div>
  )
}
