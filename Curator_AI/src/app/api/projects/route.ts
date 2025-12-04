import { getServerSession } from "next-auth"
import { authOptions } from "@/server/auth/auth-options"
import { NextResponse } from "next/server"
import { createProject } from "@/server/services/project-service"
import { z } from "zod"

const createProjectSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    techStack: z.array(z.string()),
    githubUrl: z.string().optional(),
    demoUrl: z.string().optional(),
    difficulty: z.string().optional(),
    isPublic: z.boolean().optional(),
})

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const json = await req.json()
        const body = createProjectSchema.parse(json)

        const project = await createProject(session.user.id, body)
        return NextResponse.json(project)

    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse("Invalid request data", { status: 422 })
        }
        console.error("[PROJECTS_POST]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
