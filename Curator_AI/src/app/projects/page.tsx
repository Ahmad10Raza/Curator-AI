import { Metadata } from "next"
import { Shell } from "@/components/layout/Shell"
import { ProjectCard } from "@/components/projects/ProjectCard"
import { ProjectIdeasList } from "@/components/projects/ProjectIdeasList"
import { getServerSession } from "next-auth"
import { authOptions } from "@/server/auth/auth-options"
import { getUserProjects } from "@/server/services/project-service"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

export const metadata: Metadata = {
    title: "Project Portfolio",
    description: "Showcase your coding projects and build your portfolio.",
}

export default async function ProjectsPage() {
    const session = await getServerSession(authOptions)
    if (!session?.user) redirect("/login")

    const allProjects = await getUserProjects(session.user.id)
    const projects = allProjects.filter(p => p.status !== "IDEA")

    return (
        <Shell>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Portfolio</h1>
                        <p className="text-muted-foreground">
                            Showcase your projects and track your build journey.
                        </p>
                    </div>
                    <Button className="gap-2" asChild>
                        <Link href="/projects/new">
                            <Plus className="h-4 w-4" />
                            Add Project
                        </Link>
                    </Button>
                </div>

                <Tabs defaultValue="my-projects" className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="my-projects">My Projects</TabsTrigger>
                        <TabsTrigger value="ideas">Project Ideas</TabsTrigger>
                    </TabsList>

                    <TabsContent value="my-projects" className="space-y-6">
                        {projects.length === 0 ? (
                            <div className="text-center py-12 border border-dashed rounded-lg">
                                <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
                                <p className="text-muted-foreground mb-4">
                                    Start building your portfolio by adding your first project!
                                </p>
                                <Button variant="outline" asChild>
                                    <Link href="/projects/new">Create Project</Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {projects.map((project) => (
                                    <ProjectCard key={project.id} project={project} />
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="ideas">
                        <ProjectIdeasList />
                    </TabsContent>
                </Tabs>
            </div>
        </Shell>
    )
}
