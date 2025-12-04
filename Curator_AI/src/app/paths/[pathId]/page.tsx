import { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/server/auth/auth-options"
import { getLearningPathById, getUserPathProgress } from "@/server/services/path-service"
import { Shell } from "@/components/layout/Shell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Circle, ExternalLink, PlayCircle } from "lucide-react"
import { PathEnrollButton } from "@/components/paths/PathEnrollButton"
import { PathStepItem } from "@/components/paths/PathStepItem"

interface PathDetailsPageProps {
    params: Promise<{
        pathId: string
    }>
}

export async function generateMetadata({ params }: PathDetailsPageProps): Promise<Metadata> {
    const { pathId } = await params
    const path = await getLearningPathById(pathId)
    if (!path) return { title: "Path Not Found" }
    return {
        title: path.title,
        description: path.description,
    }
}

export default async function PathDetailsPage({ params }: PathDetailsPageProps) {
    const session = await getServerSession(authOptions)
    if (!session?.user) redirect("/login")

    const { pathId } = await params
    const path = await getLearningPathById(pathId)
    if (!path) notFound()

    const userPath = await getUserPathProgress(session.user.id, pathId)

    return (
        <Shell>
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Badge variant="outline">{path.category}</Badge>
                        <Badge variant={
                            path.difficulty === "BEGINNER" ? "default" :
                                path.difficulty === "INTERMEDIATE" ? "secondary" : "destructive"
                        }>
                            {path.difficulty}
                        </Badge>
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight">{path.title}</h1>
                    <p className="text-xl text-muted-foreground">{path.description}</p>

                    <div className="flex items-center gap-4 pt-4">
                        {!userPath ? (
                            <PathEnrollButton pathId={path.id} />
                        ) : (
                            <div className="flex-1 max-w-md space-y-2">
                                <div className="flex justify-between text-sm font-medium">
                                    <span>Your Progress</span>
                                    <span>{userPath.progress}%</span>
                                </div>
                                <Progress value={userPath.progress} className="h-2" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Steps */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-semibold">Curriculum</h2>
                    <div className="grid gap-4">
                        {path.steps.map((step, index) => (
                            <PathStepItem
                                key={step.id}
                                step={step}
                                index={index}
                                isCompleted={userPath?.completedSteps.includes(step.id) || false}
                                isLocked={!userPath || (index > 0 && !userPath.completedSteps.includes(path.steps[index - 1].id))}
                                pathId={path.id}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </Shell>
    )
}
