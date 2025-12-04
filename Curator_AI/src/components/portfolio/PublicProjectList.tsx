import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Github, Globe } from "lucide-react"
import { Project } from "@prisma/client"

interface ExtendedProject extends Project {
    githubUrl?: string | null
    difficulty?: string | null
}

interface PublicProjectListProps {
    projects: ExtendedProject[]
}

export function PublicProjectList({ projects }: PublicProjectListProps) {
    if (projects.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">No public projects yet.</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
                <Card key={project.id} className="flex flex-col h-full hover:shadow-md transition-shadow">
                    <CardHeader>
                        <CardTitle className="text-xl line-clamp-2">{project.title}</CardTitle>
                        <CardDescription className="line-clamp-3 mt-2">
                            {project.description}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <div className="flex flex-wrap gap-2">
                            {project.techStack.map((tech) => (
                                <Badge key={tech} variant="outline" className="text-xs">
                                    {tech}
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter className="gap-2">
                        {project.githubUrl && (
                            <Button variant="outline" size="sm" className="w-full gap-2" asChild>
                                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                                    <Github className="h-4 w-4" />
                                    Code
                                </a>
                            </Button>
                        )}
                        {project.demoUrl && (
                            <Button variant="default" size="sm" className="w-full gap-2" asChild>
                                <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                                    <Globe className="h-4 w-4" />
                                    Demo
                                </a>
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}
