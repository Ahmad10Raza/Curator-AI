import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/server/auth/auth-options"
import { addTopicToUser, getUserStack } from "@/server/services/user-topics-service"
import { z } from "zod"

const addTopicSchema = z.object({
    topicId: z.string(),
})

export async function GET() {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const stack = await getUserStack(session.user.id)
        return NextResponse.json(stack)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch user stack" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const body = await req.json()
        const { topicId } = addTopicSchema.parse(body)
        const userTopic = await addTopicToUser(session.user.id, topicId)
        return NextResponse.json(userTopic, { status: 201 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 })
        }
        return NextResponse.json({ error: "Failed to add topic" }, { status: 500 })
    }
}
