"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import MDEditor from "@uiw/react-md-editor"
import { useTheme } from "next-themes"
import { formatDistanceToNow } from "date-fns"

interface NoteDialogProps {
    note: any
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function NoteDialog({ note, open, onOpenChange }: NoteDialogProps) {
    const { resolvedTheme } = useTheme()

    if (!note) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                        <span>Note Details</span>
                        <span className="text-xs font-normal text-muted-foreground mr-8">
                            {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
                        </span>
                    </DialogTitle>
                </DialogHeader>
                <div className="mt-4" data-color-mode={resolvedTheme === "dark" ? "dark" : "light"}>
                    <MDEditor.Markdown
                        source={note.content}
                        style={{ background: 'transparent', color: 'inherit' }}
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}
