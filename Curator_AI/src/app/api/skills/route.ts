import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/server/auth/auth-options"
import { getSkillGraph, initializeSkillGraph } from "@/server/services/skill-service"

export async function GET(req: Request) {
    const session = await getServerSession(authOptions)

    try {
        // Auto-initialize if empty (for demo purposes)
        await initializeSkillGraph()

        const graph = await getSkillGraph(session?.user?.id)
        return NextResponse.json(graph)
    } catch (error) {
        console.error("Error fetching skill graph:", error)
        return NextResponse.json({ error: "Failed to fetch skill graph" }, { status: 500 })
    }
}
