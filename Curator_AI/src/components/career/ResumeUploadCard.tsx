"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, FileText, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface ResumeUploadCardProps {
    onUploadSuccess: () => void
}

export function ResumeUploadCard({ onUploadSuccess }: ResumeUploadCardProps) {
    const [text, setText] = useState("")
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    const handleUpload = async () => {
        if (!text.trim()) return

        setLoading(true)
        try {
            const res = await fetch("/api/career/resume/upload", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text }),
            })

            if (!res.ok) throw new Error("Failed to upload resume")

            toast({
                title: "Success",
                description: "Resume uploaded and parsed successfully.",
            })
            onUploadSuccess()
            setText("")
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to upload resume. Please try again.",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleGenerate = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/career/resume/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "generate_from_learning" }),
            })

            if (!res.ok) throw new Error("Failed to generate resume")

            toast({
                title: "Success",
                description: "Resume generated from your profile.",
            })
            onUploadSuccess()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to generate resume.",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Resume Builder</CardTitle>
                <CardDescription>Upload your existing resume or generate one from your learning progress.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Textarea
                    placeholder="Paste your resume text here..."
                    className="min-h-[200px]"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <div className="flex gap-4">
                    <Button onClick={handleUpload} disabled={loading || !text.trim()}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                        Parse Resume
                    </Button>
                    <div className="flex-1 text-center text-sm text-muted-foreground self-center">OR</div>
                    <Button variant="outline" onClick={handleGenerate} disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
                        Generate from Profile
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
