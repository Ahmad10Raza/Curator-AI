import { Metadata } from "next"
import { getTopics } from "@/server/services/topics-service"
import { TopicCard } from "@/components/topics/TopicCard"
import { Shell } from "@/components/layout/Shell"
import { TopicsToolbar } from "@/components/topics/TopicsToolbar"

export const metadata: Metadata = {
    title: "Topics",
    description: "Browse all available topics",
}

interface TopicsPageProps {
    searchParams: {
        search?: string
        difficulty?: string
        category?: string
    }
}

export default async function TopicsPage({ searchParams }: TopicsPageProps) {
    const topics = await getTopics(
        searchParams.search,
        searchParams.difficulty,
        searchParams.category
    )

    return (
        <Shell>
            <div className="space-y-6 animate-fade-in">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Topics</h1>
                    <p className="text-muted-foreground">
                        Explore our collection of technology topics.
                    </p>
                </div>
                <TopicsToolbar />
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {topics.map((topic: any) => (
                        <TopicCard key={topic.id} topic={topic} />
                    ))}
                </div>
                {topics.length === 0 && (
                    <div className="text-center text-muted-foreground py-12">
                        No topics found matching your filters.
                    </div>
                )}
            </div>
        </Shell>
    )
}
