"use client"

import { useState, useEffect } from "react"
import { Shell } from "@/components/layout/Shell"
import { JobRoleCard } from "@/components/career/JobRoleCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function JobsPage() {
    const [recommendations, setRecommendations] = useState<any[]>([])
    const [targetRole, setTargetRole] = useState("")
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    const fetchRecommendations = async () => {
        try {
            const res = await fetch("/api/career/jobs")
            if (res.ok) {
                const data = await res.json()
                setRecommendations(data.recommendations)
            }
        } catch (error) {
            console.error("Failed to fetch jobs", error)
        }
    }

    useEffect(() => {
        fetchRecommendations()
    }, [])

    const handleAnalyze = async () => {
        if (!targetRole.trim()) return

        setLoading(true)
        try {
            const res = await fetch("/api/career/job-map", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role: targetRole }),
            })

            if (!res.ok) throw new Error("Failed to analyze role")

            toast({
                title: "Analysis Complete",
                description: "Job readiness score calculated.",
            })
            fetchRecommendations()
            setTargetRole("")
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to analyze role.",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Shell>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Job Recommendations</h1>
                    <p className="text-muted-foreground">
                        Analyze your skills against target roles and get a readiness score.
                    </p>
                </div>

                <div className="flex gap-4 max-w-xl">
                    <Input
                        placeholder="Enter a target role (e.g. Full Stack Developer)"
                        value={targetRole}
                        onChange={(e) => setTargetRole(e.target.value)}
                    />
                    <Button onClick={handleAnalyze} disabled={loading || !targetRole.trim()}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                        Analyze Role
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendations.map((rec, i) => (
                        <JobRoleCard key={i} recommendation={rec} />
                    ))}
                </div>

                {recommendations.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        No job analyses yet. Enter a role above to get started.
                    </div>
                )}
            </div>
        </Shell>
    )
}
