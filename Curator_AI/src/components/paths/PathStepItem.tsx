"use client"

import { PathStep } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Circle, Lock, ExternalLink, PlayCircle } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface PathStepItemProps {
    step: PathStep
    index: number
    isCompleted: boolean
    isLocked: boolean
    pathId: string
}

export function PathStepItem({ step, index, isCompleted, isLocked, pathId }: PathStepItemProps) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleComplete = async () => {
        if (isCompleted || isLocked) return

        setLoading(true)
        try {
            const res = await fetch(`/api/paths/${pathId}/progress`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ stepId: step.id }),
            })

            if (!res.ok) throw new Error("Failed to update progress")

            toast.success("Step completed! Keep going!")
            router.refresh()
        } catch (error) {
            toast.error("Failed to update progress")
        } finally {
            setLoading(false)
        }
    }

    const resources = step.resources as Array<{ title: string; url: string }> | null

    return (
        <Card className={cn(
            "transition-colors",
            isLocked ? "opacity-60 bg-muted" : "hover:border-primary/50",
            isCompleted ? "border-green-200 bg-green-50 dark:bg-green-900/10" : ""
        )}>
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                        <div className="mt-1">
                            {isCompleted ? (
                                <CheckCircle className="h-6 w-6 text-green-500" />
                            ) : isLocked ? (
                                <Lock className="h-6 w-6 text-muted-foreground" />
                            ) : (
                                <Circle className="h-6 w-6 text-primary" />
                            )}
                        </div>
                        <div>
                            <CardTitle className="text-lg font-medium leading-none mb-2">
                                {index + 1}. {step.title}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">{step.description}</p>
                        </div>
                    </div>
                    {!isLocked && !isCompleted && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleComplete}
                            disabled={loading}
                        >
                            Mark Complete
                        </Button>
                    )}
                </div>
            </CardHeader>
            {resources && resources.length > 0 && !isLocked && (
                <CardContent>
                    <div className="pl-9 space-y-2">
                        <p className="text-xs font-semibold uppercase text-muted-foreground">Resources</p>
                        <div className="flex flex-wrap gap-2">
                            {resources.map((resource, i) => (
                                <a
                                    key={i}
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-secondary text-xs font-medium hover:bg-secondary/80 transition-colors"
                                >
                                    <ExternalLink className="h-3 w-3" />
                                    {resource.title}
                                </a>
                            ))}
                        </div>
                    </div>
                </CardContent>
            )}
        </Card>
    )
}
