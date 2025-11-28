import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Brain, Sparkles, Zap } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <Link
            href="/topics"
            className="rounded-2xl bg-muted px-4 py-1.5 text-sm font-medium"
          >
            Follow along on Twitter
          </Link>
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
            Your Personal AI-Powered Tech Learning Workspace
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Curate your learning path, enhance your notes with AI, and track your progress.
            The all-in-one platform for mastering new technologies.
          </p>
          <div className="space-x-4">
            <Link href="/login">
              <Button size="lg" className="gap-2">
                Start Learning <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/topics">
              <Button variant="outline" size="lg">
                Explore Topics
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Tech Categories Preview */}
      <section className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            Master Any Technology
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            From frontend frameworks to backend systems, we have got you covered.
          </p>
        </div>
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
          {["AI/ML", "Web Development", "Cloud Computing", "DevOps", "Databases", "System Design"].map((cat) => (
            <div key={cat} className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[100px] flex-col justify-center items-center rounded-md p-6 text-center hover:bg-muted transition-colors">
                <h3 className="font-bold">{cat}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Cards */}
      <section className="container space-y-6 py-8 md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            Features
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Everything you need to accelerate your learning.
          </p>
        </div>
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <Brain className="h-12 w-12" />
              <div className="space-y-2">
                <h3 className="font-bold">AI Learning Assistant</h3>
                <p className="text-sm text-muted-foreground">Chat with an AI context-aware tutor.</p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <Sparkles className="h-12 w-12" />
              <div className="space-y-2">
                <h3 className="font-bold">Note Enhancer</h3>
                <p className="text-sm text-muted-foreground">Structure and summarize notes instantly.</p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <Zap className="h-12 w-12" />
              <div className="space-y-2">
                <h3 className="font-bold">Daily Summaries</h3>
                <p className="text-sm text-muted-foreground">Get personalized learning digests via email.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why this app? */}
      <section className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24">
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
          <div className="space-y-2">
            <h3 className="font-bold text-xl">Centralized Learning</h3>
            <p className="text-muted-foreground">Keep all your notes, progress, and resources in one place.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-xl">Personal Progress</h3>
            <p className="text-muted-foreground">Track your journey with visual boards and stats.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-xl">AI Feedback Loop</h3>
            <p className="text-muted-foreground">Constant feedback and improvement on your understanding.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
