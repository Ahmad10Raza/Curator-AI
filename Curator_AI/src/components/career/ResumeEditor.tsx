
"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Wand2, Briefcase, FileDown, Printer } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ParsedResume } from "@/server/services/resume-parser"
import { jsonToMarkdown } from "@/lib/resume-utils"
import ReactMarkdown from "react-markdown"

interface ResumeEditorProps {
    resumeData: ParsedResume
    onUpdate: () => void
}

export function ResumeEditor({ resumeData, onUpdate }: ResumeEditorProps) {
    const [loading, setLoading] = useState(false)
    const [targetRole, setTargetRole] = useState("")
    const [markdown, setMarkdown] = useState("")
    const { toast } = useToast()
    const printRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (resumeData) {
            setMarkdown(jsonToMarkdown(resumeData))
        }
    }, [resumeData])

    const handleAction = async (action: string) => {
        setLoading(true)
        try {
            const res = await fetch("/api/career/resume/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action, role: targetRole }),
            })

            if (!res.ok) throw new Error("Failed to process resume")

            toast({
                title: "Success",
                description: "Resume updated successfully.",
            })
            onUpdate()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update resume.",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const handlePrint = () => {
        const printContent = printRef.current
        if (printContent) {
            const originalContents = document.body.innerHTML
            document.body.innerHTML = printContent.innerHTML
            window.print()
            document.body.innerHTML = originalContents
            window.location.reload() // Reload to restore event listeners
        }
    }

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between shrink-0">
                <CardTitle>Resume Editor</CardTitle>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleAction("improve")} disabled={loading}>
                        <Wand2 className="mr-2 h-4 w-4" />
                        AI Improve
                    </Button>
                    <Button variant="default" size="sm" onClick={handlePrint}>
                        <Printer className="mr-2 h-4 w-4" />
                        Print / PDF
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
                <Tabs defaultValue="markdown" className="h-full flex flex-col">
                    <TabsList className="mb-4 shrink-0">
                        <TabsTrigger value="markdown">Markdown Editor</TabsTrigger>
                        <TabsTrigger value="preview">Live Preview</TabsTrigger>
                        <TabsTrigger value="tailor">Tailor to Role</TabsTrigger>
                    </TabsList>

                    <TabsContent value="markdown" className="flex-1 h-full">
                        <Textarea
                            value={markdown}
                            onChange={(e) => setMarkdown(e.target.value)}
                            className="h-full font-mono text-sm resize-none"
                            placeholder="# Your Name..."
                        />
                    </TabsContent>

                    <TabsContent value="preview" className="flex-1 h-full overflow-auto border rounded-md p-8 bg-white text-black">
                        <div ref={printRef} className="prose max-w-none print:prose-sm">
                            <ReactMarkdown>{markdown}</ReactMarkdown>
                        </div>
                    </TabsContent>

                    <TabsContent value="tailor" className="space-y-4">
                        <div className="flex gap-4">
                            <Input
                                placeholder="Target Role (e.g. Frontend Developer)"
                                value={targetRole}
                                onChange={(e) => setTargetRole(e.target.value)}
                            />
                            <Button onClick={() => handleAction("tailor")} disabled={loading || !targetRole}>
                                <Briefcase className="mr-2 h-4 w-4" />
                                Tailor Resume
                            </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            AI will reorder your skills and rewrite your summary to match this role.
                        </p>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}
