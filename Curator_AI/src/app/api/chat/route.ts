import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/server/auth/auth-options"
import { db } from "@/server/db"
import { getTopicChatResponse } from "@/server/services/chat-service"
import { z } from "zod"

const chatSchema = z.object({
    topicId: z.string(),
    messages: z.array(z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
    })),
})

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const body = await req.json()
        const { topicId, messages } = chatSchema.parse(body)

        const topic = await db.techTopic.findUnique({
            where: { id: topicId },
        })

        if (!topic) {
            return NextResponse.json({ error: "Topic not found" }, { status: 404 })
        }

        const profile = await db.profile.findUnique({
            where: { userId: session.user.id },
        })

        const response = await getTopicChatResponse(topic, profile, messages)

        return NextResponse.json({ role: "assistant", content: response })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 })
        }
        console.error(error)
        return NextResponse.json({ error: "Failed to get chat response" }, { status: 500 })
    }
}
