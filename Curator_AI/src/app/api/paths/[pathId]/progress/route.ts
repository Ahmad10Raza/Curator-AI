import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/server/auth/auth-options"
import { updatePathProgress } from "@/server/services/path-service"

export async function POST(
    req: Request,
    { params }: { params: { pathId: string } }
) {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const body = await req.json()
        const { stepId } = body

        if (!stepId) {
            return NextResponse.json({ error: "Missing stepId" }, { status: 400 })
        }

        const updatedProgress = await updatePathProgress(session.user.id, params.pathId, stepId)
        return NextResponse.json(updatedProgress)
    } catch (error) {
        console.error("Error updating progress:", error)
        return NextResponse.json({ error: "Failed to update progress" }, { status: 500 })
    }
}
