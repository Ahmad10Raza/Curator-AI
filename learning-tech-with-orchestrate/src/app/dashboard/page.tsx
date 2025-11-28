import { Metadata } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/server/auth/auth-options"
import { redirect } from "next/navigation"
import { getDashboardStats } from "@/server/services/dashboard-service"
import { getUserStack } from "@/server/services/user-topics-service"
import { MyStackBoard } from "@/components/board/MyStackBoard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, BookOpen, CheckCircle, Flame, PenTool } from "lucide-react"
import { Shell } from "@/components/layout/Shell"

export const metadata: Metadata = {
    title: "Dashboard",
    description: "Your learning dashboard",
}

export default async function DashboardPage() {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        redirect("/login")
    }

    const { stats, progress, recentNotes, continueLearning } = await getDashboardStats(session.user.id)
    const userStack = await getUserStack(session.user.id)

    return (
        <Shell>
            <div className="space-y-8 animate-fade-in">
                <div className="flex items-center justify-between space-y-2">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                        <p className="text-muted-foreground">
                            Welcome back, {session.user.name}! Here is your learning progress.
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Link href="/topics">
                            <Button>Explore Topics</Button>
                        </Link>
                    </div>
                </div>

                {/* Overview Widgets */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Topics
                            </CardTitle>
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.topicsCount}</div>
                            <p className="text-xs text-muted-foreground">
                                in your stack
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Notes Today
                            </CardTitle>
                            <PenTool className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.notesToday}</div>
                            <p className="text-xs text-muted-foreground">
                                notes created
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Streak
                            </CardTitle>
                            <Flame className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.streak} Days</div>
                            <p className="text-xs text-muted-foreground">
                                keep it up!
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Completed
                            </CardTitle>
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.completedTopics}</div>
                            <p className="text-xs text-muted-foreground">
                                topics mastered
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    {/* Continue Learning */}
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Continue Learning</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {continueLearning.length > 0 ? (
                                <div className="space-y-4">
                                    {continueLearning.map((ut: any) => (
                                        <div key={ut.id} className="flex items-center justify-between rounded-lg border p-4">
                                            <div className="space-y-1">
                                                <p className="font-medium leading-none">{ut.topic.name}</p>
                                                <p className="text-sm text-muted-foreground">{ut.topic.category}</p>
                                            </div>
                                            <Link href={`/topics/${ut.topicId}`}>
                                                <Button variant="ghost" size="sm">
                                                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
                                    <div className="text-center">
                                        <p className="text-sm text-muted-foreground">No topics in progress.</p>
                                        <Link href="/topics" className="mt-2 inline-block text-sm font-medium text-primary hover:underline">
                                            Start a new topic
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent Notes */}
                    <Card className="col-span-3">
                        <CardHeader>
                            <CardTitle>Recent Notes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {recentNotes.length > 0 ? (
                                <div className="space-y-4">
                                    {recentNotes.map((note: any) => (
                                        <div key={note.id} className="space-y-1">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-medium leading-none">{note.topic.name}</p>
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(note.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="line-clamp-2 text-xs text-muted-foreground">
                                                {note.content.substring(0, 100)}...
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">No notes created yet.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* My Stack Board */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold tracking-tight">My Stack</h3>
                    <MyStackBoard userTopics={userStack} />
                </div>
            </div>
        </Shell>
    )
}
