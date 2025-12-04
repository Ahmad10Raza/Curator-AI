import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/server/auth/auth-options"
import { enrollUserInPath } from "@/server/services/path-service"

export async function POST(
    req: Request,
    { params }: { params: { pathId: string } }
) {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const userPath = await enrollUserInPath(session.user.id, params.pathId)
        return NextResponse.json(userPath, { status: 201 })
    } catch (error) {
        console.error("Error enrolling in path:", error)
        return NextResponse.json({ error: "Failed to enroll in path" }, { status: 500 })
    }
}
