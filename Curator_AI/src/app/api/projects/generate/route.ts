import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/server/auth/auth-options"
import { generateProjectIdeas } from "@/server/ai/project-generator"

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const body = await req.json()
        const { topics, level } = body

        if (!topics || !level) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        const ideas = await generateProjectIdeas(topics, level)
        return NextResponse.json(ideas)
    } catch (error) {
        console.error("Error generating project ideas:", error)
        return NextResponse.json({ error: "Failed to generate ideas" }, { status: 500 })
    }
}
