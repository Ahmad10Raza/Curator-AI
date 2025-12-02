"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import MDEditor from "@uiw/react-md-editor"
import { useTheme } from "next-themes"

interface NoteEditorProps {
    topicId: string
}

export function NoteEditor({ topicId }: NoteEditorProps) {
    const [content, setContent] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(false)
    const [preview, setPreview] = React.useState<"edit" | "preview">("edit")
    const router = useRouter()
    const { resolvedTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

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
            setPreview("edit")
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

    if (!mounted) {
        return (
            <div className="space-y-4">
                <div className="flex justify-end mb-2">
                    <Button variant="ghost" size="sm" disabled className="text-muted-foreground">
                        Loading Editor...
                    </Button>
                </div>
                <div className="min-h-[200px] border rounded-md bg-muted/50 animate-pulse" />
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-end mb-2">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPreview(preview === "edit" ? "preview" : "edit")}
                    className="text-muted-foreground"
                >
                    {preview === "edit" ? "Switch to Preview" : "Switch to Edit"}
                </Button>
            </div>
            <div data-color-mode={resolvedTheme === "dark" ? "dark" : "light"}>
                <MDEditor
                    value={content}
                    onChange={(val) => setContent(val || "")}
                    height={400}
                    preview={preview}
                    className="min-h-[200px]"
                    visibleDragbar={false}
                    hideToolbar={false}
                    enableScroll={true}
                    style={{
                        backgroundColor: 'transparent',
                        color: 'inherit',
                        borderColor: 'hsl(var(--border))'
                    }}
                />
            </div>
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
