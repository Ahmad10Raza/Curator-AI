"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Rocket, Code2, BarChart } from "lucide-react"
import { useRouter } from "next/navigation"

interface ProjectIdea {
    title: string
    description: string
    techStack: string[]
    difficulty: string
}

interface ProjectIdeaCardProps {
    idea: ProjectIdea
}

export function ProjectIdeaCard({ idea }: ProjectIdeaCardProps) {
    const router = useRouter()

    const handleStart = () => {
        const params = new URLSearchParams({
            title: idea.title,
            description: idea.description,
            techStack: idea.techStack.join(","),
            difficulty: idea.difficulty
        })
        router.push(`/projects/new?${params.toString()}`)
    }

    return (
        <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
            <CardHeader>
                <div className="flex justify-between items-start gap-4">
                    <CardTitle className="text-xl line-clamp-2">{idea.title}</CardTitle>
                    <Badge variant={
                        idea.difficulty === "Beginner" ? "secondary" :
                            idea.difficulty === "Intermediate" ? "default" : "destructive"
                    }>
                        {idea.difficulty}
                    </Badge>
                </div>
                <CardDescription className="line-clamp-3 mt-2">
                    {idea.description}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <div className="flex flex-wrap gap-2">
                    {idea.techStack.map((tech) => (
                        <Badge key={tech} variant="outline" className="text-xs">
                            {tech}
                        </Badge>
                    ))}
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleStart} className="w-full gap-2">
                    <Rocket className="h-4 w-4" />
                    Start Project
                </Button>
            </CardFooter>
        </Card>
    )
}
