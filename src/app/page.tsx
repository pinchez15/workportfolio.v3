import { ArrowRight, Check, Upload } from "lucide-react"
import Link from "next/link"


import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-900">
                WorkPortfolio
              </Link>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="#" className="text-blue-600 font-medium">
                Home
              </Link>
              <Link href="#features" className="text-gray-600 hover:text-gray-900">
                Features
              </Link>
              <Link href="#pricing" className="text-gray-600 hover:text-gray-900">
                Pricing
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 lg:py-32 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between">
          <div className="max-w-xl">
            <p className="text-blue-600 font-medium mb-6 tracking-wide">FOR PROFESSIONALS WHO MOVE FAST</p>
            <h1 className="text-5xl lg:text-[56px] font-black text-neutral-900 mb-6">
              Don&apos;t tell. <span className="text-blue-600">Show.</span>
            </h1>
            <p className="text-xl text-gray-600 leading-snug max-w-lg mb-8">
              You do great work. You just need a simple, beautiful way to show it off.
            </p>
            <ul className="text-left space-y-2 text-sm text-gray-800 mb-8">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">●</span>
                Portfolios live in under 5 minutes
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">●</span>
                No domains. No design decisions.
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">●</span>
                Perfect for LinkedIn, resumes, cold outreach
              </li>
            </ul>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link href="/portfolio">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow">
                  Create Your Free Portfolio →
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="bg-white hover:bg-gray-100 border border-gray-300 text-gray-800 font-semibold px-6 py-3 rounded-lg">
                View Live Example
              </Button>
            </div>
            <div className="relative ml-auto">
              <Card className="rounded-2xl shadow-xl bg-white p-6 w-full max-w-md">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                        S
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Sarah Miller</h3>
                        <p className="text-gray-600 text-sm">Product Designer</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Badge className="bg-green-100 text-green-800 border-green-200">LIVE</Badge>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">workportfolio.io/sarah</p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-400 rounded"></div>
                        <div>
                          <p className="font-medium text-gray-900">E-commerce Redesign</p>
                          <p className="text-sm text-gray-600">Increased conversion by 34%</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-blue-600">
                        LIVE
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-400 rounded"></div>
                        <div>
                          <p className="font-medium text-gray-900">Mobile App MVP</p>
                          <p className="text-sm text-gray-600">0 to 10k users in 3 months</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        VIEW
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="absolute -bottom-2 -left-2">
                <span className="rounded-lg px-3 py-1 bg-white shadow text-sm text-gray-500">Built in 4 minutes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

{/* Problem Section */}
<section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-red-600 font-medium mb-4 tracking-wide">THE PROBLEM</p>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Traditional platforms make it <span className="text-red-600 italic">way too hard</span>
              </h2>

              <Card className="mt-8">
                <CardHeader>
                  <CardTitle className="text-gray-900">The Old Way: Hours of Setup</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-700">Buy domain ($15/year)</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-700">Choose hosting ($10/month)</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-700">Design layout (6+ hours)</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-700">Write content (3+ hours)</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-700">Hope it works on mobile</span>
                  </div>
                  <div className="border-t pt-4 mt-4">
                    <div className="bg-red-50 p-3 rounded text-center">
                      <span className="font-bold text-red-700">Total: 10+ hours, $120+/year</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Website builders take forever</h3>
                <p className="text-gray-600">
                  Website builders like Wix take too long. You need a domain, theme, and time you don&apos;t have. Most
                  professionals give up halfway through or launch something that looks amateur.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Your work gets buried in text</h3>
                <p className="text-gray-600">
                                  LinkedIn posts get lost in feeds. Resumes hide your best work in bullet points. Email signatures can&apos;t
                show screenshots. You&apos;re tired of <em>describing</em> what you&apos;ve built.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Good work should speak for itself</h3>
                <p className="text-gray-600 mb-4">
                  If your work speaks for itself, <em>why is it so hard to show it?</em> You shouldn&apos;t need to be a web
                  designer to showcase your actual skills.
                </p>

                <div className="border-l-4 border-red-500 pl-6 bg-red-50 p-4">
                  <p className="font-bold text-gray-900 mb-2">
                    Don&apos;t let your best work get lost in resumes and long bios.
                  </p>
                  <p className="text-gray-700">Stop explaining—start showing.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Add a Project</CardTitle>
                    <span className="text-sm text-gray-500">Takes 2 min</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Project Title</Label>
                    <Input id="title" placeholder="E-commerce Redesign" />
                  </div>
                  <div>
                    <Label htmlFor="achievement">What you achieved</Label>
                    <Textarea id="achievement" placeholder="Increased conversion by 34%..." />
                  </div>
                  <div>
                    <Label>Screenshot or Demo</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                      <p className="text-gray-500">Drag & Drop</p>
                    </div>
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">Publish Project ✨</Button>
                </CardContent>
              </Card>
              <p className="text-center mt-4 text-sm text-gray-600">
                That&apos;s it. <span className="text-green-600 font-medium">Live in under 5 minutes.</span>
              </p>
            </div>
            <div>
              <p className="text-blue-600 font-medium mb-4 tracking-wide">WE GET IT</p>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">We&apos;ve been there</h2>
              <div className="space-y-6 text-gray-600">
                <p>
                  We&apos;ve built the all-day websites. We&apos;ve scrolled endlessly through LinkedIn trying to explain projects
                  with bullet points.
                </p>
                                  <p>We&apos;ve pitched clients with 20-slide decks when a single screenshot would have closed the deal.</p>
              </div>
              <div className="mt-8 p-6 border-l-4 border-blue-600 bg-blue-50">
                                  <h3 className="font-bold text-gray-900 mb-2">That&apos;s why we created WorkPortfolio</h3>
                <p className="text-gray-700 mb-4">
                  A tool made <em>only</em> for showcasing your work. Fast, visual, and designed to help you look
                  professional—without the learning curve.
                </p>
                <div className="flex items-center text-blue-600">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                  <span className="font-medium">Built by professionals, for professionals</span>
                </div>
              </div>
              <div className="mt-8 space-y-4">
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">
                    <strong>No technical skills needed</strong>
                  </span>
                </div>
                <p className="text-gray-600 ml-8">If you can post on LinkedIn, you can build a portfolio</p>

                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">
                    <strong>Visual-first approach</strong>
                  </span>
                </div>
                <p className="text-gray-600 ml-8">Show screenshots, demos, and results—not just descriptions</p>

                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">
                    <strong>Professional by default</strong>
                  </span>
                </div>
                <p className="text-gray-600 ml-8">Clean, modern design that makes your work shine</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-blue-600 font-medium mb-4 tracking-wide">SIMPLE PROCESS</p>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Create your professional portfolio in minutes, not hours</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="text-center">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                  1
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Sign Up</h3>
                <p className="text-gray-600 mb-6">
                  Sign in with your LinkedIn account or email. No credit card required.
                </p>
                <div className="flex items-center justify-center text-blue-600 text-sm">
                  <span className="mr-2">🔐</span>
                  Sign in securely with LinkedIn or email
                </div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                  2
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Create Projects</h3>
                <p className="text-gray-600 mb-6">Add your projects and links, as simply as posting on LinkedIn.</p>
                <div className="flex items-center justify-center text-purple-600 text-sm">
                  <span className="mr-2">📸</span>
                  Upload screenshots, add links, write results
                </div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                  3
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Share Anywhere</h3>
                <p className="text-gray-600 mb-6">
                  Share your portfolio with potential clients, employers, or investors.
                </p>
                <div className="flex items-center justify-center text-green-600 text-sm">
                  <span className="mr-2">🔗</span>
                  workportfolio.io/yourname
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <div className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              Average time: 4 minutes
            </div>
                            <p className="text-xl text-gray-600 mb-8">That&apos;s it. No domains, no themes, no excuses.</p>
            <Link href="/portfolio">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Start Building Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Pricing</h2>
            <p className="text-xl text-gray-600">
              No custom domains or advanced themes—WorkPortfolio is built for speed, not complexity.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Free Plan</CardTitle>
                <div className="text-4xl font-bold text-gray-900 mt-4">Free</div>
                <CardDescription className="mt-2">What&apos;s Included</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>One simple theme</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Up to 4 projects</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>A clean, personal portfolio link</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Quick, distraction-free layout</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>No setup, no learning curve, no cost</span>
                </div>
                <Link href="/portfolio">
                  <Button variant="outline" className="w-full mt-6 bg-transparent">
                    Create Your Free Portfolio
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-blue-200 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-600 text-white">Most Popular</Badge>
              </div>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Pro</CardTitle>
                <div className="text-4xl font-bold text-gray-900 mt-4">
                  $8 <span className="text-lg font-normal text-gray-600">/month</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">or $50/year</p>
                <Button variant="link" className="text-blue-600 p-0 h-auto">
                  Upgrade to Pro
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Unlimited projects</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Priority support</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>CTA buttons</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Vote on new features</span>
                </div>
                <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700">Upgrade to Pro</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">What Users Say</h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-6">
                <p className="text-gray-700 mb-4">
                  &quot;I built my portfolio in less than 10 minutes. Now I can finally show my work instead of just talking
                  about it.&quot;
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-medium mr-3">
                    RK
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">— Rachel K.</p>
                    <p className="text-sm text-gray-600">Product Manager</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <p className="text-gray-700 mb-4">
                  &quot;I spent hours trying to build a website before this. WorkPortfolio just works.&quot;
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-medium mr-3">
                    TA
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">— Tom A.</p>
                    <p className="text-sm text-gray-600">Developer</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-blue-200 font-medium mb-4 tracking-wide">YOUR SUCCESS</p>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                Everyone has great AI-written resumes. <span className="text-yellow-400">Proof matters.</span>
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Stop explaining—<em>start showing</em>. AI wrote their résumé. You wrote the code, built the app,
                launched the brand. Show it.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-400 mr-3" />
                  <span>You look professional and credible</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-400 mr-3" />
                  <span>You stand out from the crowd</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-400 mr-3" />
                  <span>You land opportunities faster</span>
                </div>
              </div>
              <div className="mt-8 p-6 bg-blue-700 rounded-lg">
                <p className="text-blue-100">WorkPortfolio is built for people who do good work and want to show it.</p>
              </div>
            </div>

            <div>
              <Card className="bg-white text-gray-900">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-4">Ready to show your work?</h3>
                  <p className="text-gray-600 mb-6">
                    Join professionals who&apos;ve ditched lengthy explanations for visual proof.
                  </p>
                  <Link href="/portfolio">
                    <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 mb-4">
                      Create Your Free Portfolio
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full mr-1"></span>
                      Free forever
                    </span>
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                      Live in 5 minutes
                    </span>
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-red-400 rounded-full mr-1"></span>
                      No credit card
                    </span>
                  </div>
                </CardContent>
              </Card>

              <div className="mt-8 p-6 bg-blue-700 rounded-lg">
                <p className="text-blue-100 italic mb-4">
                  &quot;Finally, a portfolio that took 5 minutes, not 5 hours. I shared it the same day and booked two
                  calls.&quot;
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-pink-400 rounded-full flex items-center justify-center text-white font-medium mr-3">
                    S
                  </div>
                  <div>
                    <p className="font-medium">Sarah Chen</p>
                    <p className="text-sm text-blue-200">Product Designer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-gray-900 mb-4">WorkPortfolio</h3>
              <p className="text-gray-600 text-sm">Work Portfolios to show your work and advance your career.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="#" className="hover:text-gray-900">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-gray-900">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-gray-900">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="#" className="hover:text-gray-900">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-gray-900">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Connect</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="#" className="hover:text-gray-900">
                    LinkedIn
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center">
            <p className="text-sm text-gray-500">
              © 2025 WorkPortfolio. Product of CappaWork LLC. All rights reserved.
            </p>
          </div>
        </div>

        {/* Fixed CTA Button */}
        <div className="fixed bottom-6 right-6">
          <Link href="/portfolio">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 shadow-lg">
              Create Your Free Portfolio
            </Button>
          </Link>
        </div>
      </footer>
    </div>
  )
}
