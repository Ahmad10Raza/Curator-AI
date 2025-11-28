import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/server/auth/auth-options"
import { createNote, getNotesForTopic } from "@/server/services/notes-service"
import { z } from "zod"

const createNoteSchema = z.object({
    topicId: z.string(),
    content: z.string().min(1),
})

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const body = await req.json()
        const { topicId, content } = createNoteSchema.parse(body)
        const note = await createNote(session.user.id, topicId, content)
        return NextResponse.json(note, { status: 201 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 })
        }
        return NextResponse.json({ error: "Failed to create note" }, { status: 500 })
    }
}

export async function GET(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const topicId = searchParams.get("topicId")

    if (!topicId) {
        return NextResponse.json({ error: "Topic ID required" }, { status: 400 })
    }

    try {
        const notes = await getNotesForTopic(session.user.id, topicId)
        return NextResponse.json(notes)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 })
    }
}
