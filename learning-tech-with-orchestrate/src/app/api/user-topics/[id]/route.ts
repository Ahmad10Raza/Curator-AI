import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/server/auth/auth-options"
import { updateUserTopicStatus } from "@/server/services/user-topics-service"
import { z } from "zod"

const updateStatusSchema = z.object({
    status: z.enum(["NOT_STARTED", "IN_PROGRESS", "COMPLETED"]),
})

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const { id } = await params
        const body = await req.json()
        const { status } = updateStatusSchema.parse(body)
        const updated = await updateUserTopicStatus(id, status)
        return NextResponse.json(updated)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 })
        }
        return NextResponse.json({ error: "Failed to update status" }, { status: 500 })
    }
}
