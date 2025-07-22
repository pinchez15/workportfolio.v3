import { ArrowRight, Check, Upload, Star, Users, Zap } from "lucide-react"
import Link from "next/link"
import { UserButton, SignInButton } from "@clerk/nextjs"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                WorkPortfolio
              </Link>
              <nav className="hidden md:flex space-x-8">
                <Link href="#" className="text-blue-600 font-medium hover:text-blue-700 transition-colors">
                  Home
                </Link>
                <Link href="#features" className="text-slate-600 hover:text-slate-900 transition-colors">
                  Features
                </Link>
                <Link href="#pricing" className="text-slate-600 hover:text-slate-900 transition-colors">
                  Pricing
                </Link>
              </nav>
            </div>
            <div className="flex items-center">
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200 px-3 py-1 text-sm font-medium">
                  FOR PROFESSIONALS WHO MOVE FAST
                </Badge>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                  Don&apos;t tell.{" "}
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Show.
                  </span>
                </h1>
                <p className="text-xl text-slate-600 leading-relaxed max-w-2xl">
                  You do great work. You just need a simple, beautiful way to show it off.
                </p>
              </div>

              {/* Benefits List */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-slate-700">Portfolios live in under 5 minutes</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-slate-700">No domains. No design decisions.</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-slate-700">Perfect for LinkedIn, resumes, cold outreach</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <SignInButton mode="modal">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                    Create Your Free Portfolio
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </SignInButton>
                <Link href="https://www.workportfolio.io/natepinches" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="lg" className="border-2 border-slate-300 text-slate-700 font-semibold px-8 py-4 rounded-xl hover:bg-slate-50 transition-all duration-200">
                    View Live Example
                  </Button>
                </Link>
              </div>

              {/* Social Proof */}
              <div className="flex items-center space-x-6 pt-4">
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-medium">
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <span className="text-sm text-slate-600">Join 2,000+ professionals</span>
                </div>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                  <span className="text-sm text-slate-600 ml-1">4.9/5</span>
                </div>
              </div>
            </div>

            {/* Right Content - Portfolio Preview */}
            <div className="relative">
              <div className="relative z-10">
                <Card className="bg-white shadow-2xl rounded-2xl border-0 overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                          S
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 text-lg">Sarah Miller</h3>
                          <p className="text-slate-600">Product Designer</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800 border-green-200 font-medium">
                        LIVE
                      </Badge>
                    </div>
                    
                    <p className="text-slate-500 text-sm mb-6 font-mono">workportfolio.io/sarah</p>

                    <div className="space-y-4">
                      <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg"></div>
                            <div>
                              <p className="font-semibold text-slate-900">E-commerce Redesign</p>
                              <p className="text-sm text-slate-600">Increased conversion by 34%</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                            LIVE
                          </Button>
                        </div>
                      </div>

                      <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg"></div>
                            <div>
                              <p className="font-semibold text-slate-900">Mobile App MVP</p>
                              <p className="text-sm text-slate-600">0 to 10k users in 3 months</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                            VIEW
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-slate-100">
                      <p className="text-xs text-slate-500 flex items-center">
                        <Zap className="w-3 h-3 mr-1" />
                        Built in 4 minutes
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Background decoration */}
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-4 -left-4 w-48 h-48 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="destructive" className="bg-red-100 text-red-700 border-red-200 px-3 py-1 text-sm font-medium">
                  THE PROBLEM
                </Badge>
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
                  Traditional platforms make it{" "}
                  <span className="text-red-600 italic">way too hard</span>
                </h2>
              </div>

              <Card className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-100">
                  <CardTitle className="text-slate-900 text-xl">The Old Way: Hours of Setup</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {[
                    { text: "Buy domain ($15/year)", time: "" },
                    { text: "Choose hosting ($10/month)", time: "" },
                    { text: "Design layout", time: "6+ hours" },
                    { text: "Write content", time: "3+ hours" },
                    { text: "Hope it works on mobile", time: "" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-2">
                      <span className="text-slate-700">{item.text}</span>
                      {item.time && <span className="text-red-600 font-medium">{item.time}</span>}
                    </div>
                  ))}
                  <div className="border-t border-slate-200 pt-4 mt-4">
                    <div className="bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-xl text-center border border-red-100">
                      <span className="font-bold text-red-700 text-lg">Total: 10+ hours, $120+/year</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Website builders take forever</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Website builders like Wix take too long. You need a domain, theme, and time you don&apos;t have. Most
                    professionals give up halfway through or launch something that looks amateur.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Your work gets buried in text</h3>
                  <p className="text-slate-600 leading-relaxed">
                    LinkedIn posts get lost in feeds. Resumes hide your best work in bullet points. Email signatures can&apos;t
                    show screenshots. You&apos;re tired of <em>describing</em> what you&apos;ve built.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Good work should speak for itself</h3>
                  <p className="text-slate-600 leading-relaxed mb-6">
                    If your work speaks for itself, <em>why is it so hard to show it?</em> You shouldn&apos;t need to be a web
                    designer to showcase your actual skills.
                  </p>

                  <div className="border-l-4 border-red-500 pl-6 bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-r-xl">
                    <p className="font-bold text-slate-900 mb-2 text-lg">
                      Don&apos;t let your best work get lost in resumes and long bios.
                    </p>
                    <p className="text-slate-700">Stop explaining—start showing.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Card className="bg-white shadow-xl border-0 rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-100">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-slate-900 text-xl">Add a Project</CardTitle>
                    <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                      Takes 2 min
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-slate-700 font-medium">Project Title</Label>
                    <Input id="title" placeholder="E-commerce Redesign" className="border-slate-200 focus:border-blue-500" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="achievement" className="text-slate-700 font-medium">What you achieved</Label>
                    <Textarea id="achievement" placeholder="Increased conversion by 34%..." className="border-slate-200 focus:border-blue-500" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-medium">Screenshot or Demo</Label>
                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                      <Upload className="w-8 h-8 mx-auto mb-3 text-slate-400" />
                      <p className="text-slate-500 font-medium">Drag & Drop</p>
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl">
                    Publish Project ✨
                  </Button>
                </CardContent>
              </Card>
              <p className="text-center mt-6 text-slate-600">
                That&apos;s it. <span className="text-green-600 font-semibold">Live in under 5 minutes.</span>
              </p>
            </div>
            
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-blue-100 text-blue-700 border-blue-200 px-3 py-1 text-sm font-medium">
                  WE GET IT
                </Badge>
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
                  We&apos;ve been there
                </h2>
              </div>
              
              <div className="space-y-6 text-slate-600 leading-relaxed">
                <p className="text-lg">
                  We&apos;ve built the all-day websites. We&apos;ve scrolled endlessly through LinkedIn trying to explain projects
                  with bullet points.
                </p>
                <p className="text-lg">
                  We&apos;ve pitched clients with 20-slide decks when a single screenshot would have closed the deal.
                </p>
              </div>
              
              <div className="p-6 border-l-4 border-blue-600 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-r-xl">
                <h3 className="font-bold text-slate-900 mb-3 text-lg">That&apos;s why we created WorkPortfolio</h3>
                <p className="text-slate-700 mb-4 leading-relaxed">
                  A tool made <em>only</em> for showcasing your work. Fast, visual, and designed to help you look
                  professional—without the learning curve.
                </p>
                <div className="flex items-center text-blue-600 font-medium">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  Built by professionals, for professionals
                </div>
              </div>
              
              <div className="space-y-6">
                {[
                  {
                    title: "No technical skills needed",
                    description: "If you can post on LinkedIn, you can build a portfolio"
                  },
                  {
                    title: "Visual-first approach",
                    description: "Show screenshots, demos, and results—not just descriptions"
                  },
                  {
                    title: "Professional by default",
                    description: "Clean, modern design that makes your work shine"
                  }
                ].map((feature, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <Check className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 mb-1">{feature.title}</p>
                      <p className="text-slate-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-blue-100 text-blue-700 border-blue-200 px-3 py-1 text-sm font-medium mb-4">
              SIMPLE PROCESS
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6 leading-tight">
              How It Works
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Create your professional portfolio in minutes, not hours
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                step: "1",
                title: "Sign Up",
                description: "Sign in with your LinkedIn account or email. No credit card required.",
                icon: "🔐",
                detail: "Sign in securely with LinkedIn or email"
              },
              {
                step: "2",
                title: "Create Projects",
                description: "Add your projects and links, as simply as posting on LinkedIn.",
                icon: "📸",
                detail: "Upload screenshots, add links, write results"
              },
              {
                step: "3",
                title: "Share Anywhere",
                description: "Share your portfolio with potential clients, employers, or investors.",
                icon: "🔗",
                detail: "workportfolio.io/yourname"
              }
            ].map((item, index) => (
              <Card key={index} className="text-center bg-white shadow-lg border-0 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <CardContent className="pt-8 pb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-lg">
                    {item.step}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">{item.title}</h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-center text-blue-600 text-sm font-medium">
                    <span className="mr-2">{item.icon}</span>
                    {item.detail}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <div className="inline-block bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-6 py-3 rounded-full text-sm font-semibold mb-6 border border-green-200">
              Average time: 4 minutes
            </div>
            <p className="text-xl text-slate-600 mb-8">That&apos;s it. No domains, no themes, no excuses.</p>
            <SignInButton mode="modal">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                Start Building Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </SignInButton>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6 leading-tight">Pricing</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              No custom domains or advanced themes—WorkPortfolio is built for speed, not complexity.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="text-center bg-gradient-to-r from-slate-50 to-gray-50 border-b border-slate-200">
                <CardTitle className="text-2xl text-slate-900">Free Plan</CardTitle>
                <div className="text-4xl font-bold text-slate-900 mt-4">Free</div>
                <CardDescription className="mt-2 text-slate-600">What&apos;s Included</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {[
                  "One simple theme",
                  "Up to 4 projects",
                  "A clean, personal portfolio link",
                  "Quick, distraction-free layout",
                  "No setup, no learning curve, no cost"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-slate-700">{feature}</span>
                  </div>
                ))}
                <SignInButton mode="modal">
                  <Button variant="outline" className="w-full mt-6 border-2 border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl py-3">
                    Create Your Free Portfolio
                  </Button>
                </SignInButton>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-xl border-2 border-blue-200 rounded-2xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 px-4 py-1">
                  Most Popular
                </Badge>
              </div>
              <CardHeader className="text-center bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-200">
                <CardTitle className="text-2xl text-slate-900">Pro</CardTitle>
                <div className="text-4xl font-bold text-slate-900 mt-4">
                  $8 <span className="text-lg font-normal text-slate-600">/month</span>
                </div>
                <p className="text-sm text-slate-600 mt-2">or $50/year</p>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {[
                  "Unlimited projects",
                  "Priority support",
                  "CTA buttons",
                  "Vote on new features"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-slate-700">{feature}</span>
                  </div>
                ))}
                <Button className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl py-3">
                  Upgrade to Pro
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-slate-900 mb-16 leading-tight">
            What Users Say
          </h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                quote: "I built my portfolio in less than 10 minutes. Now I can finally show my work instead of just talking about it.",
                name: "Rachel K.",
                role: "Product Manager",
                initials: "RK"
              },
              {
                quote: "I spent hours trying to build a website before this. WorkPortfolio just works.",
                name: "Tom A.",
                role: "Developer",
                initials: "TA"
              }
            ].map((testimonial, index) => (
              <Card key={index} className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8">
                  <p className="text-slate-700 mb-6 leading-relaxed text-lg">
                    &quot;{testimonial.quote}&quot;
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                      {testimonial.initials}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{testimonial.name}</p>
                      <p className="text-slate-600">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-blue-500/20 text-blue-100 border-blue-400/30 px-3 py-1 text-sm font-medium">
                  YOUR SUCCESS
                </Badge>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                  Everyone has great AI-written resumes.{" "}
                  <span className="text-yellow-300">Proof matters.</span>
                </h2>
              </div>
              
              <p className="text-xl text-blue-100 leading-relaxed">
                Stop explaining—<em>start showing</em>. AI wrote their résumé. You wrote the code, built the app,
                launched the brand. Show it.
              </p>
              
              <div className="space-y-4">
                {[
                  "You look professional and credible",
                  "You stand out from the crowd",
                  "You land opportunities faster"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                    <span className="text-blue-100">{benefit}</span>
                  </div>
                ))}
              </div>
              
              <div className="p-6 bg-blue-700/50 rounded-2xl border border-blue-600/50">
                <p className="text-blue-100 text-lg">
                  WorkPortfolio is built for people who do good work and want to show it.
                </p>
              </div>
            </div>

            <div className="space-y-8">
              <Card className="bg-white text-slate-900 shadow-2xl border-0 rounded-2xl overflow-hidden">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-4">Ready to show your work?</h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    Join professionals who&apos;ve ditched lengthy explanations for visual proof.
                  </p>
                  <SignInButton mode="modal">
                    <Button size="lg" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 mb-6 rounded-xl py-4 font-semibold">
                      Create Your Free Portfolio
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </SignInButton>
                  <div className="flex items-center justify-center space-x-6 text-sm text-slate-500">
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                      Free forever
                    </span>
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                      Live in 5 minutes
                    </span>
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                      No credit card
                    </span>
                  </div>
                </CardContent>
              </Card>

              <div className="p-6 bg-blue-700/50 rounded-2xl border border-blue-600/50">
                <p className="text-blue-100 italic mb-4 leading-relaxed">
                  &quot;Finally, a portfolio that took 5 minutes, not 5 hours. I shared it the same day and booked two calls.&quot;
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold mr-4">
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
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-slate-900 mb-4 text-lg">WorkPortfolio</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Work Portfolios to show your work and advance your career.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>
                  <Link href="#" className="hover:text-slate-900 transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-slate-900 transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-slate-900 transition-colors">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>
                  <Link href="#" className="hover:text-slate-900 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-slate-900 transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Connect</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>
                  <Link href="#" className="hover:text-slate-900 transition-colors">
                    LinkedIn
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-200 mt-8 pt-8 text-center">
            <p className="text-sm text-slate-500">
              © 2025 WorkPortfolio. Product of CappaWork LLC. All rights reserved.
            </p>
          </div>
        </div>

        {/* Fixed CTA Button */}
        <div className="fixed bottom-6 right-6 z-50">
          <SignInButton mode="modal">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-200 rounded-xl px-6 py-3">
              Create Your Free Portfolio
            </Button>
          </SignInButton>
        </div>
      </footer>
    </div>
  )
}
