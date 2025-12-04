import { getServerSession } from "next-auth"
import { authOptions } from "@/server/auth/auth-options"
import { NextResponse } from "next/server"
import { updateProject, deleteProject } from "@/server/services/project-service"
import { z } from "zod"

const updateProjectSchema = z.object({
    title: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    techStack: z.array(z.string()).optional(),
    githubUrl: z.string().optional(),
    demoUrl: z.string().optional(),
    difficulty: z.string().optional(),
    isPublic: z.boolean().optional(),
})

export async function PATCH(
    req: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const json = await req.json()
        const body = updateProjectSchema.parse(json)

        const project = await updateProject(params.id, session.user.id, body)
        return NextResponse.json(project)

    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse("Invalid request data", { status: 422 })
        }
        console.error("[PROJECT_PATCH]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function DELETE(
    req: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        await deleteProject(params.id, session.user.id)
        return new NextResponse(null, { status: 204 })

    } catch (error) {
        console.error("[PROJECT_DELETE]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
