import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/server/auth/auth-options"
import { getLearningPathById, getUserPathProgress } from "@/server/services/path-service"

export async function GET(
    req: Request,
    props: { params: Promise<{ pathId: string }> }
) {
    const params = await props.params
    const session = await getServerSession(authOptions)

    try {
        const path = await getLearningPathById(params.pathId)
        if (!path) {
            return NextResponse.json({ error: "Path not found" }, { status: 404 })
        }

        let userProgress = null
        if (session?.user) {
            userProgress = await getUserPathProgress(session.user.id, params.pathId)
        }

        return NextResponse.json({ path, userProgress })
    } catch (error) {
        console.error("Error fetching path:", error)
        return NextResponse.json({ error: "Failed to fetch path" }, { status: 500 })
    }
}
