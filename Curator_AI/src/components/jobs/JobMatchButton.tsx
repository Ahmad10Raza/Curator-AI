"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function JobMatchButton() {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleMatch = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/jobs/match", {
                method: "POST",
            })

            if (!res.ok) throw new Error("Failed to find matches")

            toast.success("Found new job matches!")
            router.refresh()
        } catch (error) {
            toast.error("Failed to find matches. Make sure your profile is complete.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button onClick={handleMatch} disabled={loading}>
            {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Find Matches
        </Button>
    )
}
