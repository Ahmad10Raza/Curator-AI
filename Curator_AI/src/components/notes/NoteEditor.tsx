"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

interface NoteEditorProps {
    topicId: string
}

export function NoteEditor({ topicId }: NoteEditorProps) {
    const [content, setContent] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(false)
    const router = useRouter()

    async function onSave() {
        if (!content.trim()) return

        setIsLoading(true)
        try {
            const response = await fetch("/api/notes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    topicId,
                    content,
                }),
            })

            if (!response.ok) {
                throw new Error("Failed to save note")
            }

            setContent("")
            router.refresh()
            toast.success("Note saved", {
                description: "Your note has been saved successfully.",
            })
        } catch (error) {
            toast.error("Error", {
                description: "Something went wrong. Please try again.",
            })
        } finally {
            setIsLoading(false)
        }
    }

    async function onEnhance(mode: "summarize" | "structure") {
        if (!content.trim() || isLoading) return

        setIsLoading(true)
        try {
            const response = await fetch("/api/notes-enhance", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    content,
                    mode,
                }),
            })

            if (!response.ok) {
                throw new Error("Failed to enhance note")
            }

            const data = await response.json()
            setContent(data.content)
            toast.success("Note enhanced", {
                description: "Your note has been updated.",
            })
        } catch (error) {
            toast.error("Error", {
                description: "Something went wrong. Please try again.",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-4">
            <Textarea
                placeholder="Write your note here... (Markdown supported)"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[200px]"
            />
            <div className="flex justify-between gap-2">
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => onEnhance("structure")} disabled={isLoading || !content.trim()}>
                        Structure
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => onEnhance("summarize")} disabled={isLoading || !content.trim()}>
                        Summarize
                    </Button>
                </div>
                <Button onClick={onSave} disabled={isLoading || !content.trim()}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Note
                </Button>
            </div>
        </div>
    )
}
