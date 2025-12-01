"use client"

import { Note, TechTopic } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface NotesListProps {
    notes: (Note & { topic?: TechTopic })[]
    view?: "grid" | "list"
}

export function NotesList({ notes, view = "grid" }: NotesListProps) {
    if (notes.length === 0) {
        return (
            <div className="text-center text-muted-foreground py-8 border border-dashed rounded-md">
                No notes yet. Start writing!
            </div>
        )
    }

    return (
        <div className={cn(
            "grid gap-4",
            view === "grid" ? "sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
        )}>
            {notes.map((note) => (
                note.topic ? (
                    <Link key={note.id} href={`/topics/${note.topicId}`} className="block h-full">
                        <Card className="flex flex-col h-full hover:shadow-md transition-shadow cursor-pointer hover:border-primary/50">
                            <CardHeader className="py-3 space-y-1">
                                <div className="flex justify-between items-start gap-2">
                                    <Badge variant="outline" className="line-clamp-1 max-w-[150px]">
                                        {note.topic.name}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                                        {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent className="py-3 pt-0 flex-1">
                                <div className="whitespace-pre-wrap text-sm line-clamp-6 text-muted-foreground">
                                    {note.content}
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ) : (
                    <Card key={note.id} className="flex flex-col h-full hover:shadow-md transition-shadow">
                        <CardHeader className="py-3 space-y-1">
                            <div className="flex justify-between items-start gap-2">
                                <span className="text-xs text-muted-foreground whitespace-nowrap ml-auto">
                                    {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent className="py-3 pt-0 flex-1">
                            <div className="whitespace-pre-wrap text-sm line-clamp-6 text-muted-foreground">
                                {note.content}
                            </div>
                        </CardContent>
                    </Card>
                )
            ))}
        </div>
    )
}
