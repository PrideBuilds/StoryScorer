import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sparkles,
  Zap,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Star,
  Feather,
  BookOpen,
  PenTool,
  MessageSquare,
} from "lucide-react";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If user is authenticated, redirect to dashboard
  if (user) {
    redirect("/dashboard");
  }

  // For unauthenticated users, show the landing page with marketing layout
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-slate-900">
      <MarketingNav />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-20 lg:pt-32 lg:pb-32 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
              <div className="flex-1 text-center lg:text-left z-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 text-violet-700 text-sm font-medium mb-6">
                  <Sparkles className="h-4 w-4" />
                  <span>AI-Powered Writing Assistant</span>
                </div>
                <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight text-slate-900">
                  Instant AI feedback on your <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-blue-600">writing and storytelling.</span>
                </h1>
                <p className="text-lg lg:text-xl text-slate-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Elevate your craft with Story Scorer. Analyze quality, engagement, and style in seconds to captivate your readers.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                  <Button size="lg" className="text-lg px-8 py-6 rounded-full bg-violet-600 hover:bg-violet-700 shadow-xl shadow-violet-200 transition-all hover:scale-105" asChild>
                    <Link href="/signup">Try Story Scorer Free</Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="ghost"
                    className="text-lg px-8 py-6 rounded-full hover:bg-slate-100 text-slate-700"
                    asChild
                  >
                    <Link href="/#how-it-works">How It Works</Link>
                  </Button>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-4 text-sm text-slate-500 font-medium">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs overflow-hidden">
                        <Users className="w-4 h-4 text-slate-400" />
                      </div>
                    ))}
                  </div>
                  <p>Trusted by 10,000+ writers</p>
                </div>
              </div>
              <div className="flex-1 relative w-full max-w-[600px] lg:max-w-none">
                <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl bg-white p-2 animate-in fade-in zoom-in duration-700">
                  <Image
                    src="/images/landing/hero-illustration.png"
                    alt="AI analyzing a story"
                    width={800}
                    height={800}
                    className="rounded-xl w-full h-auto object-cover"
                    priority
                  />
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-10 -right-10 w-64 h-64 bg-violet-400/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Brand/Social Proof Strip */}
        <section className="py-10 border-y border-slate-100 bg-white">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-6">Empowering creators from</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale transition-all hover:grayscale-0">
              {/* Simulated Logos with Text for now */}
              <span className="text-xl font-bold font-serif text-slate-600">Medium</span>
              <span className="text-xl font-bold font-mono text-slate-600">Substack</span>
              <span className="text-xl font-bold text-slate-600">Wattpad</span>
              <span className="text-xl font-bold font-serif italic text-slate-600">Reedsy</span>
            </div>
          </div>
        </section>

        {/* Dashboard Preview Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">See your story through AI eyes</h2>
              <p className="text-xl text-slate-600">Get a comprehensive breakdown of what works and what needs polish, instantly.</p>
            </div>
            <div className="relative max-w-5xl mx-auto rounded-xl shadow-2xl border border-slate-200 bg-slate-50 p-2 lg:p-4">
              <Image
                src="/images/landing/dashboard-preview.png"
                alt="Story Scorer Dashboard"
                width={1200}
                height={800}
                className="rounded-lg w-full h-auto shadow-sm"
              />
              {/* Floating Feature Badges */}
              <div className="absolute -right-4 top-20 hidden lg:flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-lg border border-slate-100 animate-bounce delay-700">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="font-medium text-sm">Tone: Optimistic</span>
              </div>
              <div className="absolute -left-4 bottom-20 hidden lg:flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-lg border border-slate-100 animate-bounce delay-1000">
                <div className="w-3 h-3 rounded-full bg-violet-500"></div>
                <span className="font-medium text-sm">Engagement: High</span>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-24 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
              <p className="text-xl text-slate-600">Three simple steps to better writing.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
              <div className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-2xl bg-white shadow-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-slate-100">
                  <PenTool className="w-8 h-8 text-violet-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">1. Write or Paste</h3>
                <p className="text-slate-600">Draft your story directly in our distraction-free editor or paste existing content.</p>
              </div>

              <div className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-2xl bg-white shadow-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-slate-100">
                  <Brain className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">2. Analyze Instantly</h3>
                <p className="text-slate-600">Our AI scans for pacing, tone, clarity, and engagement factors in seconds.</p>
              </div>

              <div className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-2xl bg-white shadow-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-slate-100">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">3. Improve</h3>
                <p className="text-slate-600">Get actionable insights and watch your Story Score climb as you refine.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Why Writers Love Us</h2>
              <p className="text-xl text-slate-600">More than just a spell checker. We analyze the soul of your story.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-6">
                    <Zap className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900">Engagement Scoring</h3>
                  <p className="text-slate-600">Know exactly when you're losing your reader's attention and how to hook them back.</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-violet-50 rounded-lg flex items-center justify-center mb-6">
                    <Feather className="w-6 h-6 text-violet-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900">Style Analysis</h3>
                  <p className="text-slate-600">Refine your unique voice with feedback on sentence variety, active voice, and imagery.</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-6">
                    <BookOpen className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900">Narrative Clarity</h3>
                  <p className="text-slate-600">Ensure your plot points land and your message is clear without dumbing it down.</p>
                </CardContent>
              </Card>

              {/* More benefits... */}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid-pattern.svg')] opacity-10"></div>
          <div className="container mx-auto px-4 relative z-10">
            <h2 className="text-3xl lg:text-4xl font-bold text-center mb-16">Community Feedback</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="bg-slate-800 border-slate-700 text-slate-200">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4 text-yellow-400"><Star className="fill-current w-4 h-4" /><Star className="fill-current w-4 h-4" /><Star className="fill-current w-4 h-4" /><Star className="fill-current w-4 h-4" /><Star className="fill-current w-4 h-4" /></div>
                  <p className="mb-6 italic">"Story Scorer detected a pacing issue in my second act that I had struggled with for weeks. Fixed it in 10 minutes."</p>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-600"></div>
                    <div>
                      <p className="font-bold text-white">Elena R.</p>
                      <p className="text-sm text-slate-400">Fiction Writer</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700 text-slate-200">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4 text-yellow-400"><Star className="fill-current w-4 h-4" /><Star className="fill-current w-4 h-4" /><Star className="fill-current w-4 h-4" /><Star className="fill-current w-4 h-4" /><Star className="fill-current w-4 h-4" /></div>
                  <p className="mb-6 italic">"The engagement score is addictive. It challenges me to make every paragraph punchier."</p>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-600"></div>
                    <div>
                      <p className="font-bold text-white">Marcus T.</p>
                      <p className="text-sm text-slate-400">Content Creator</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700 text-slate-200">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4 text-yellow-400"><Star className="fill-current w-4 h-4" /><Star className="fill-current w-4 h-4" /><Star className="fill-current w-4 h-4" /><Star className="fill-current w-4 h-4" /><Star className="fill-current w-4 h-4" /></div>
                  <p className="mb-6 italic">"I use it for all my blog posts now. It's like having a ruthless editor on my shoulder, but nicer."</p>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-600"></div>
                    <div>
                      <p className="font-bold text-white">Jessica L.</p>
                      <p className="text-sm text-slate-400">Freelance Editor</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 bg-gradient-to-r from-violet-600 to-blue-600 text-white text-center">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">Ready to tell better stories?</h2>
            <p className="text-xl lg:text-2xl text-violet-100 mb-10">Join thousands of writers who rely on Story Scorer for instant feedback.</p>
            <Button size="lg" className="text-lg px-10 py-8 rounded-full bg-white text-violet-600 hover:bg-slate-100 shadow-2xl transition-transform hover:scale-105" asChild>
              <Link href="/signup">Analyze Your Story Free</Link>
            </Button>
            <p className="mt-6 text-sm opacity-70">No credit card required. Free plan available forever.</p>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}
