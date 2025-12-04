"use client"

import { Note, TechTopic } from "@prisma/client"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import { NoteCard } from "./NoteCard"

interface NotesListProps {
    notes: (Note & { topic?: TechTopic })[]
    view?: "grid" | "list"
}

export function NotesList({ notes, view = "grid" }: NotesListProps) {
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

    if (notes.length === 0) {
        return (
            <div className="text-center text-muted-foreground py-8 border border-dashed rounded-md">
                No notes yet. Start writing!
            </div>
        )
    }

    // Group notes by category
    const notesByCategory = notes.reduce((acc, note) => {
        const category = note.topic?.category || "Uncategorized"
        if (!acc[category]) {
            acc[category] = []
        }
        acc[category].push(note)
        return acc
    }, {} as Record<string, typeof notes>)

    const toggleCategory = (category: string) => {
        const newExpanded = new Set(expandedCategories)
        if (newExpanded.has(category)) {
            newExpanded.delete(category)
        } else {
            newExpanded.add(category)
        }
        setExpandedCategories(newExpanded)
    }

    // Sort categories alphabetically
    const sortedCategories = Object.keys(notesByCategory).sort()

    return (
        <div className="space-y-6">
            {sortedCategories.map((category) => {
                const categoryNotes = notesByCategory[category]
                const isExpanded = expandedCategories.has(category)

                return (
                    <div key={category} className="space-y-3">
                        <button
                            onClick={() => toggleCategory(category)}
                            className="flex items-center gap-2 text-lg font-semibold hover:text-primary transition-colors w-full"
                        >
                            {isExpanded ? (
                                <ChevronDown className="h-5 w-5" />
                            ) : (
                                <ChevronRight className="h-5 w-5" />
                            )}
                            <span>{category}</span>
                            <Badge variant="secondary" className="ml-2">
                                {categoryNotes.length}
                            </Badge>
                        </button>

                        {isExpanded && (
                            <div className={cn(
                                "grid gap-4",
                                view === "grid" ? "sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
                            )}>
                                {categoryNotes.map((note) => (
                                    <NoteCard key={note.id} note={note} />
                                ))}
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}

