import { Metadata } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/server/auth/auth-options"
import { getTopicById } from "@/server/services/topics-service"
import { Shell } from "@/components/layout/Shell"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getNotesForTopic } from "@/server/services/notes-service"
import { NoteEditor } from "@/components/notes/NoteEditor"
import { NotesList } from "@/components/notes/NotesList"
import { ChatPanel } from "@/components/chat/ChatPanel"
import { db } from "@/server/db"
import { TopicStatusButton } from "@/components/topics/TopicStatusButton"

interface TopicPageProps {
    params: Promise<{
        topicId: string
    }>
}

export async function generateMetadata({ params }: TopicPageProps): Promise<Metadata> {
    const { topicId } = await params
    const topic = await getTopicById(topicId)
    return {
        title: topic?.name || "Topic",
    }
}

export default async function TopicPage({ params }: TopicPageProps) {
    const session = await getServerSession(authOptions)
    const { topicId } = await params
    const topic = await getTopicById(topicId)

    if (!topic) {
        notFound()
    }

    const notes = session?.user ? await getNotesForTopic(session.user.id, topic.id) : []

    // Fetch user topic status
    let userTopicStatus = "NOT_STARTED"
    let userTopic = null
    if (session?.user) {
        userTopic = await db.userTopic.findFirst({
            where: {
                userId: session.user.id,
                topicId: topic.id,
            },
        })
        if (userTopic) {
            userTopicStatus = userTopic.status
        }
    }

    return (
        <Shell>
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-10">
                {/* Left Column: Topic Info */}
                <div className="space-y-6 lg:col-span-1">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <h1 className="text-3xl font-bold tracking-tight">{topic.name}</h1>
                            <Badge variant={topic.difficulty === "BEGINNER" ? "secondary" : topic.difficulty === "INTERMEDIATE" ? "default" : "destructive"}>
                                {topic.difficulty}
                            </Badge>
                        </div>
                        <p className="text-muted-foreground">{topic.description}</p>
                    </div>

                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                        <h3 className="font-semibold mb-4">Your Progress</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Status</span>
                                <Badge variant="outline">{userTopicStatus}</Badge>
                            </div>
                            <TopicStatusButton topicId={topic.id} initialStatus={userTopicStatus} />
                        </div>
                    </div>

                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                        <h3 className="font-semibold mb-4">Related Topics</h3>
                        <p className="text-sm text-muted-foreground">Coming soon...</p>
                    </div>
                </div>

                {/* Right Column: Notes & AI */}
                <div className="space-y-6 lg:col-span-2">
                    <Tabs defaultValue="notes" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="notes">Notes</TabsTrigger>
                            <TabsTrigger value="chat">AI Assistant</TabsTrigger>
                        </TabsList>
                        <TabsContent value="notes" className="space-y-4 mt-4">
                            <div className="grid gap-6">
                                <NoteEditor topicId={topic.id} />
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">Your Notes</h3>
                                    <NotesList notes={notes} />
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent value="chat" className="mt-4">
                            <ChatPanel topicId={topic.id} />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </Shell>
    )
}
