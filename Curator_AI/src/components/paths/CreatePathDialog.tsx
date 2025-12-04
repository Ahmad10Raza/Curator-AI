"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Sparkles } from "lucide-react"
import { toast } from "sonner"

export function CreatePathDialog() {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const [formData, setFormData] = useState({
        topic: "",
        goal: "",
        level: "BEGINNER",
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch("/api/paths", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            if (!res.ok) throw new Error("Failed to generate path")

            const path = await res.json()
            toast.success("Learning path generated successfully!")
            setOpen(false)
            router.push(`/paths/${path.id}`)
            router.refresh()
        } catch (error) {
            toast.error("Failed to generate path. Please try again.")
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Sparkles className="h-4 w-4" />
                    Generate New Path
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Generate AI Learning Path</DialogTitle>
                    <DialogDescription>
                        Tell us what you want to learn, and our AI will create a structured curriculum for you.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="topic">What do you want to learn?</Label>
                        <Input
                            id="topic"
                            placeholder="e.g., React, Python, Machine Learning"
                            value={formData.topic}
                            onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="goal">What is your goal?</Label>
                        <Textarea
                            id="goal"
                            placeholder="e.g., Build a full-stack app, Get a job as a Data Scientist"
                            value={formData.goal}
                            onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="level">Current Level</Label>
                        <Select
                            value={formData.level}
                            onValueChange={(value) => setFormData({ ...formData, level: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="BEGINNER">Beginner</SelectItem>
                                <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                                <SelectItem value="ADVANCED">Advanced</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {loading ? "Generating..." : "Generate Path"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
