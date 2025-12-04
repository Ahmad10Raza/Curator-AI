import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/server/auth/auth-options"
import { getLearningPaths, createLearningPath } from "@/server/services/path-service"
import { generateLearningPath } from "@/server/ai/path-generator"

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const category = searchParams.get("category") || undefined

        const paths = await getLearningPaths(category)
        return NextResponse.json(paths)
    } catch (error) {
        console.error("Error fetching paths:", error)
        return NextResponse.json({ error: "Failed to fetch paths" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const body = await req.json()
        const { topic, goal, level } = body

        if (!topic || !goal || !level) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        // Generate path using AI
        const generatedPath = await generateLearningPath(topic, goal, level)

        // Save to database
        const newPath = await createLearningPath({
            ...generatedPath,
            creatorId: session.user.id,
            isPublic: false, // Private by default for generated paths
        })

        return NextResponse.json(newPath, { status: 201 })
    } catch (error) {
        console.error("Error generating path:", error)
        return NextResponse.json({ error: "Failed to generate path" }, { status: 500 })
    }
}
