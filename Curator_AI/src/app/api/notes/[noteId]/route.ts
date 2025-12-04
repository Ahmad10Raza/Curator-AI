import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/server/auth/auth-options"
import { db } from "@/server/db"
import { z } from "zod"

const updateNoteSchema = z.object({
    content: z.string().min(1),
})

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ noteId: string }> }
) {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const { noteId } = await params
        const body = await req.json()
        const { content } = updateNoteSchema.parse(body)

        // Verify note belongs to user
        const existingNote = await db.note.findUnique({
            where: { id: noteId },
        })

        if (!existingNote || existingNote.userId !== session.user.id) {
            return NextResponse.json({ error: "Note not found" }, { status: 404 })
        }

        // Update the note
        const updatedNote = await db.note.update({
            where: { id: noteId },
            data: { content },
        })

        return NextResponse.json(updatedNote)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 })
        }
        return NextResponse.json({ error: "Failed to update note" }, { status: 500 })
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ noteId: string }> }
) {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const { noteId } = await params

        // Verify note belongs to user
        const existingNote = await db.note.findUnique({
            where: { id: noteId },
        })

        if (!existingNote || existingNote.userId !== session.user.id) {
            return NextResponse.json({ error: "Note not found" }, { status: 404 })
        }

        // Delete the note
        await db.note.delete({
            where: { id: noteId },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete note" }, { status: 500 })
    }
}
