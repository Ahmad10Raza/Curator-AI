"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import MDEditor from "@uiw/react-md-editor"

interface RecentNotesProps {
    notes: any[]
}

export function RecentNotes({ notes }: RecentNotesProps) {
    return (
        <div className="space-y-8">
            {notes.length > 0 ? (
                <div className="space-y-4">
                    {notes.map((note: any) => (
                        <div key={note.id} className="space-y-1">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium leading-none">{note.topic.name}</p>
                                <span className="text-xs text-muted-foreground">
                                    {new Date(note.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="line-clamp-2 text-xs text-muted-foreground pointer-events-none overflow-hidden">
                                <MDEditor.Markdown source={note.content} style={{ background: 'transparent', color: 'inherit', fontSize: 'inherit' }} />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-muted-foreground">No notes created yet.</p>
            )}
        </div>
    )
}
