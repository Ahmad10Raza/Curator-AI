import { NextResponse } from "next/server"
import { getTopicById } from "@/server/services/topics-service"

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const topic = await getTopicById(id)
        if (!topic) {
            return NextResponse.json({ error: "Topic not found" }, { status: 404 })
        }
        return NextResponse.json(topic)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch topic" }, { status: 500 })
    }
}
