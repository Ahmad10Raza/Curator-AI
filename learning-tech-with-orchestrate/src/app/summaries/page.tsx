import { Metadata } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/server/auth/auth-options"
import { redirect } from "next/navigation"
import { db } from "@/server/db"
import { Shell } from "@/components/layout/Shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { CheckCircle, BookOpen, PenTool } from "lucide-react"

export const metadata: Metadata = {
    title: "Daily Summaries",
    description: "Your learning history",
}

export default async function SummariesPage() {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        redirect("/login")
    }

    const logs = await db.dailyLog.findMany({
        where: {
            userId: session.user.id,
        },
        orderBy: {
            date: "desc",
        },
    })

    return (
        <Shell>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Daily Summaries</h1>
                    <p className="text-muted-foreground">
                        Track your daily learning achievements.
                    </p>
                </div>

                <div className="space-y-8">
                    {logs.length === 0 ? (
                        <div className="text-center text-muted-foreground py-12 border border-dashed rounded-md">
                            No learning logs yet. Start learning to generate summaries!
                        </div>
                    ) : (
                        <div className="relative border-l border-muted ml-4 space-y-8 pb-8">
                            {logs.map((log: any) => (
                                <div key={log.id} className="relative pl-8">
                                    <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full border bg-background" />
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold leading-none">
                                                {format(new Date(log.date), "MMMM d, yyyy")}
                                            </h3>
                                            <span className="text-xs text-muted-foreground">
                                                {format(new Date(log.date), "EEEE")}
                                            </span>
                                        </div>
                                        <Card>
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                                    Activity
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="flex gap-4 text-sm">
                                                    <div className="flex items-center gap-1">
                                                        <BookOpen className="h-4 w-4" />
                                                        <span>{log.topicsTouched} Topics</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <PenTool className="h-4 w-4" />
                                                        <span>{log.noteCount} Notes</span>
                                                    </div>
                                                </div>
                                                {/* If we had summary text stored, we would display it here */}
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Shell>
    )
}
