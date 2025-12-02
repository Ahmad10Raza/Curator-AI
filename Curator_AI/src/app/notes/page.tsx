import { Metadata } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/server/auth/auth-options"
import { redirect } from "next/navigation"
import { db } from "@/server/db"
import { Shell } from "@/components/layout/Shell"
import { NotesList } from "@/components/notes/NotesList"
import { NotesToolbar } from "@/components/notes/NotesToolbar"

export const metadata: Metadata = {
    title: "Notes",
    description: "Your personal notes",
}

interface NotesPageProps {
    searchParams: Promise<{
        search?: string
        view?: "grid" | "list"
    }>
}

export default async function NotesPage({ searchParams }: NotesPageProps) {
    const session = await getServerSession(authOptions)
    const { search, view } = await searchParams

    if (!session?.user) {
        redirect("/login")
    }

    const notes = await db.note.findMany({
        where: {
            userId: session.user.id,
            content: search
                ? { contains: search, mode: 'insensitive' }
                : undefined,
        },
        orderBy: {
            createdAt: "desc",
        },
        include: {
            topic: true,
        },
    })

    return (
        <Shell>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Notes</h1>
                    <p className="text-muted-foreground">
                        Manage and organize your learning notes.
                    </p>
                </div>
                <NotesToolbar />
                <NotesList notes={notes} view={view || "grid"} />
            </div>
        </Shell>
    )
}
