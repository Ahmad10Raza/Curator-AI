"use client"

import { useState } from "react"
import { ResumeProfile } from "@prisma/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Save, Wand2 } from "lucide-react"
import { toast } from "sonner"

interface ResumeBuilderProps {
    initialProfile: ResumeProfile | null
}

export function ResumeBuilder({ initialProfile }: ResumeBuilderProps) {
    const [loading, setLoading] = useState(false)
    const [analyzing, setAnalyzing] = useState(false)
    const [profile, setProfile] = useState({
        summary: initialProfile?.summary || "",
        skills: initialProfile?.skills.join(", ") || "",
    })
    const [analysis, setAnalysis] = useState<any>(null)

    const handleSave = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/resume", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    summary: profile.summary,
                    skills: profile.skills.split(",").map(s => s.trim()).filter(Boolean),
                }),
            })

            if (!res.ok) throw new Error("Failed to save profile")
            toast.success("Profile saved successfully")
        } catch (error) {
            toast.error("Failed to save profile")
        } finally {
            setLoading(false)
        }
    }

    const handleAnalyze = async () => {
        setAnalyzing(true)
        try {
            const res = await fetch("/api/resume/analyze", {
                method: "POST",
            })

            if (!res.ok) throw new Error("Failed to analyze resume")

            const data = await res.json()
            setAnalysis(data)
            toast.success("Analysis complete!")
        } catch (error) {
            toast.error("Failed to analyze resume")
        } finally {
            setAnalyzing(false)
        }
    }

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Resume Profile</CardTitle>
                    <CardDescription>Update your profile to get better job matches.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="summary">Professional Summary</Label>
                        <Textarea
                            id="summary"
                            placeholder="Brief summary of your experience and goals..."
                            className="min-h-[150px]"
                            value={profile.summary}
                            onChange={(e) => setProfile({ ...profile, summary: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="skills">Skills (comma separated)</Label>
                        <Input
                            id="skills"
                            placeholder="React, Node.js, TypeScript..."
                            value={profile.skills}
                            onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={handleSave} disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            <Save className="mr-2 h-4 w-4" />
                            Save Profile
                        </Button>
                        <Button variant="outline" onClick={handleAnalyze} disabled={analyzing}>
                            {analyzing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            <Wand2 className="mr-2 h-4 w-4" />
                            Analyze with AI
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {analysis && (
                <Card className="bg-muted/50">
                    <CardHeader>
                        <CardTitle>AI Analysis</CardTitle>
                        <CardDescription>Feedback to improve your profile.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <h4 className="font-semibold text-sm">Feedback</h4>
                            <p className="text-sm text-muted-foreground">{analysis.feedback}</p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-semibold text-sm">Missing Skills</h4>
                            <div className="flex flex-wrap gap-2">
                                {analysis.missingSkills.map((skill: string) => (
                                    <span key={skill} className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded dark:bg-red-900/30 dark:text-red-300">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-semibold text-sm">Suggested Roles</h4>
                            <div className="flex flex-wrap gap-2">
                                {analysis.suggestedRoles.map((role: string) => (
                                    <span key={role} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded dark:bg-blue-900/30 dark:text-blue-300">
                                        {role}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
