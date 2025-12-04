import { Metadata } from "next"
import { Shell } from "@/components/layout/Shell"
import { ProjectForm } from "@/components/projects/ProjectForm"
import { getServerSession } from "next-auth"
import { authOptions } from "@/server/auth/auth-options"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
    title: "New Project",
    description: "Create a new project for your portfolio.",
}

interface NewProjectPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function NewProjectPage({ searchParams }: NewProjectPageProps) {
    const session = await getServerSession(authOptions)
    if (!session?.user) redirect("/login")

    const params = await searchParams
    const initialData = {
        title: typeof params.title === "string" ? params.title : "",
        description: typeof params.description === "string" ? params.description : "",
        techStack: typeof params.techStack === "string" ? params.techStack : "",
        difficulty: typeof params.difficulty === "string" ? params.difficulty : "Beginner",
    }

    return (
        <Shell>
            <div className="max-w-2xl mx-auto space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Add New Project</h1>
                    <p className="text-muted-foreground">
                        Add details about your project to showcase in your portfolio.
                    </p>
                </div>

                <div className="border rounded-lg p-6 bg-card">
                    <ProjectForm initialData={initialData} />
                </div>
            </div>
        </Shell>
    )
}
