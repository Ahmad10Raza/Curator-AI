"use client"

import { Note, TechTopic } from "@prisma/client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import MDEditor from "@uiw/react-md-editor"
import { useState } from "react"
import { useTheme } from "next-themes"
import { Eye, Edit, Save, X, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { NoteDialog } from "./NoteDialog"

interface NoteCardProps {
    note: Note & { topic?: TechTopic }
}

export function NoteCard({ note }: NoteCardProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
    const [content, setContent] = useState(note.content)
    const [isLoading, setIsLoading] = useState(false)
    const [preview, setPreview] = useState<"edit" | "preview">("edit")
    const { resolvedTheme } = useTheme()
    const router = useRouter()

    async function onSave() {
        if (!content.trim()) return

        setIsLoading(true)
        try {
            const response = await fetch(`/api/notes/${note.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    content,
                }),
            })

            if (!response.ok) {
                throw new Error("Failed to update note")
            }

            setIsEditing(false)
            setPreview("edit")
            router.refresh()
            toast.success("Note updated", {
                description: "Your note has been updated successfully.",
            })
        } catch (error) {
            toast.error("Error", {
                description: "Something went wrong. Please try again.",
            })
        } finally {
            setIsLoading(false)
        }
    }

    function onCancel() {
        setContent(note.content)
        setIsEditing(false)
        setPreview("edit")
    }

    return (
        <>
            <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
                <CardHeader className="py-3 space-y-2">
                    <div className="flex justify-between items-start gap-2">
                        <div className="flex flex-col gap-1 flex-1">
                            {note.topic && (
                                <Badge variant="outline" className="w-fit">
                                    {note.topic.name}
                                </Badge>
                            )}
                            <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
                            </span>
                        </div>
                        {!isEditing && (
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsViewDialogOpen(true)}
                                    className="h-8"
                                >
                                    <Eye className="h-4 w-4 mr-1" />
                                    View
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsEditing(true)}
                                    className="h-8"
                                >
                                    <Edit className="h-4 w-4 mr-1" />
                                    Edit
                                </Button>
                            </div>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="py-3 pt-0 flex-1 overflow-hidden">
                    {isEditing ? (
                        <div className="space-y-3">
                            <div className="flex justify-end">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setPreview(preview === "edit" ? "preview" : "edit")}
                                    className="text-muted-foreground h-7"
                                >
                                    {preview === "edit" ? "Preview" : "Edit"}
                                </Button>
                            </div>
                            <div data-color-mode={resolvedTheme === "dark" ? "dark" : "light"}>
                                <MDEditor
                                    value={content}
                                    onChange={(val) => setContent(val || "")}
                                    height={300}
                                    preview={preview}
                                    className="min-h-[200px]"
                                    visibleDragbar={false}
                                    hideToolbar={false}
                                    enableScroll={true}
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={onCancel}
                                    disabled={isLoading}
                                >
                                    <X className="h-3 w-3 mr-1" />
                                    Cancel
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={onSave}
                                    disabled={isLoading || !content.trim()}
                                >
                                    {isLoading && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                                    <Save className="h-3 w-3 mr-1" />
                                    Save
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-sm text-muted-foreground line-clamp-6">
                            <MDEditor.Markdown
                                source={note.content}
                                style={{ background: 'transparent', color: 'inherit' }}
                            />
                        </div>
                    )}
                </CardContent>
            </Card>

            <NoteDialog
                note={note}
                open={isViewDialogOpen}
                onOpenChange={setIsViewDialogOpen}
            />
        </>
    )
}
