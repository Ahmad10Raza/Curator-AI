"use client"

import { useState, useEffect } from "react"
import { ProjectIdeaCard } from "./ProjectIdeaCard"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface ProjectIdea {
    title: string
    description: string
    techStack: string[]
    difficulty: string
}

export function ProjectIdeasList() {
    const [ideas, setIdeas] = useState<ProjectIdea[]>([])
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    // Fetch saved ideas on mount
    useEffect(() => {
        const loadIdeas = async () => {
            try {
                const res = await fetch("/api/projects/ideas")
                if (res.ok) {
                    const data = await res.json()
                    setIdeas(data.ideas)
                }
            } catch (error) {
                console.error("Failed to load ideas", error)
            }
        }
        loadIdeas()
    }, [])

    const generateMoreIdeas = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/projects/ideas/generate", {
                method: "POST"
            })
            if (!res.ok) throw new Error("Failed to generate ideas")
            const data = await res.json()
            setIdeas(data.ideas)

            toast({
                title: "Fresh Ideas!",
                description: "New project ideas have been added to your list.",
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to generate project ideas. Please try again.",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    if (ideas.length === 0 && !loading) {
        return (
            <div className="text-center py-12 border border-dashed rounded-lg bg-muted/10">
                <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
                    <div className="p-4 rounded-full bg-primary/10 text-primary">
                        <Sparkles className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-semibold">Need Inspiration?</h3>
                    <p className="text-muted-foreground">
                        Get AI-powered project ideas tailored to your current skills and learning progress.
                    </p>
                    <Button onClick={generateMoreIdeas} size="lg" className="gap-2">
                        <Sparkles className="h-4 w-4" />
                        Generate Ideas
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold tracking-tight">Suggested Projects</h2>
                <Button variant="outline" size="sm" onClick={generateMoreIdeas} disabled={loading} className="gap-2">
                    <Sparkles className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                    Generate More Ideas
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ideas.map((idea, idx) => (
                    <ProjectIdeaCard key={idx} idea={idea} />
                ))}
            </div>
        </div>
    )
}
