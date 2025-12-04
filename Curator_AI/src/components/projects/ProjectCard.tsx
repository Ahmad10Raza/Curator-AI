"use client"

import { Project } from "@prisma/client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Github, Globe, Lock, Unlock } from "lucide-react"

interface ProjectCardProps {
    project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
    return (
        <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
            <CardHeader>
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                        {project.isPublic ? (
                            <Badge variant="secondary" className="gap-1">
                                <Unlock className="h-3 w-3" /> Public
                            </Badge>
                        ) : (
                            <Badge variant="outline" className="gap-1">
                                <Lock className="h-3 w-3" /> Private
                            </Badge>
                        )}
                    </div>
                </div>
                <CardTitle className="line-clamp-1">{project.title}</CardTitle>
                <CardDescription className="line-clamp-2">{project.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
                <div className="flex flex-wrap gap-2 mb-4">
                    {project.techStack.map((tech) => (
                        <Badge key={tech} variant="outline" className="text-xs">
                            {tech}
                        </Badge>
                    ))}
                </div>
            </CardContent>
            <CardFooter className="gap-2">
                {project.repoUrl && (
                    <Button variant="outline" size="sm" className="w-full" asChild>
                        <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                            <Github className="mr-2 h-4 w-4" />
                            Code
                        </a>
                    </Button>
                )}
                {project.demoUrl && (
                    <Button variant="default" size="sm" className="w-full" asChild>
                        <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                            <Globe className="mr-2 h-4 w-4" />
                            Demo
                        </a>
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}
