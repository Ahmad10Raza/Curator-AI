import { Metadata } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/server/auth/auth-options"
import { redirect } from "next/navigation"
import { Shell } from "@/components/layout/Shell"
import { getUserSummaries } from "@/server/services/ai-summary-service"
import { SummaryCard } from "@/components/timeline/SummaryCard"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata: Metadata = {
    title: "Timeline",
    description: "Your daily learning summaries",
}

export default async function TimelinePage() {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        redirect("/login")
    }

    const summaries = await getUserSummaries(session.user.id, 30)

    return (
        <Shell>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Learning Timeline</h1>
                        <p className="text-muted-foreground">
                            Your daily AI-generated learning summaries and insights.
                        </p>
                    </div>
                    <Link href="/api/summaries" className="hidden">
                        <Button variant="outline">Generate Today's Summary</Button>
                    </Link>
                </div>

                {summaries.length === 0 ? (
                    <div className="text-center py-12 border border-dashed rounded-lg">
                        <h3 className="text-lg font-semibold mb-2">No summaries yet</h3>
                        <p className="text-muted-foreground mb-4">
                            Start taking notes and completing topics to get your first daily summary!
                        </p>
                        <Link href="/topics">
                            <Button>Explore Topics</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {summaries.map((summary) => (
                            <SummaryCard key={summary.id} summary={summary} />
                        ))}
                    </div>
                )}
            </div>
        </Shell>
    )
}
