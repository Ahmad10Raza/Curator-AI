import { getServerSession } from "next-auth"
import { authOptions } from "@/server/auth/auth-options"
import { NextResponse } from "next/server"
import { db } from "@/server/db"
import { generateProjectIdeas } from "@/server/ai/project-generator"

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        // Fetch user profile and topics
        const profile = await db.profile.findUnique({
            where: { userId: session.user.id }
        })

        // Fetch existing ideas from DB
        const savedIdeas = await db.project.findMany({
            where: {
                userId: session.user.id,
                status: "IDEA"
            },
            orderBy: { createdAt: "desc" }
        })

        return NextResponse.json({ ideas: savedIdeas })

    } catch (error) {
        console.error("[PROJECT_IDEAS]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
