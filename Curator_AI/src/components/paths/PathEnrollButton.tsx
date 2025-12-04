"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function PathEnrollButton({ pathId }: { pathId: string }) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleEnroll = async () => {
        setLoading(true)
        try {
            const res = await fetch(`/api/paths/${pathId}/enroll`, {
                method: "POST",
            })

            if (!res.ok) throw new Error("Failed to enroll")

            toast.success("Enrolled successfully! Let's start learning.")
            router.refresh()
        } catch (error) {
            toast.error("Failed to enroll. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button size="lg" onClick={handleEnroll} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Start Learning Path
        </Button>
    )
}
