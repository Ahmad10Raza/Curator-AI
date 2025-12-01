"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2, PlusCircle, CheckCircle } from "lucide-react"

interface TopicStatusButtonProps {
    topicId: string
    initialStatus: string
}

export function TopicStatusButton({ topicId, initialStatus }: TopicStatusButtonProps) {
    const [status, setStatus] = useState(initialStatus)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const onEnroll = async () => {
        try {
            setIsLoading(true)
            const response = await fetch(`/api/topics/${topicId}/enroll`, {
                method: "POST",
            })

            if (!response.ok) throw new Error("Failed to enroll")

            setStatus("IN_PROGRESS")
            toast.success("Enrolled in topic successfully!")
            router.refresh()
        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

    const onUpdateStatus = async (newStatus: string) => {
        try {
            setIsLoading(true)
            const response = await fetch(`/api/topics/${topicId}/status`, {
                method: "PATCH",
                body: JSON.stringify({ status: newStatus }),
            })

            if (!response.ok) throw new Error("Failed to update status")

            setStatus(newStatus)
            toast.success(newStatus === "COMPLETED" ? "Topic marked as completed!" : "Topic status updated")
            router.refresh()
        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

    if (status === "COMPLETED") {
        return (
            <div className="space-y-2">
                <Button variant="outline" className="w-full cursor-default bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700 dark:bg-green-900/20 dark:text-green-400">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Completed
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => onUpdateStatus("IN_PROGRESS")}
                    disabled={isLoading}
                >
                    Reopen Topic
                </Button>
            </div>
        )
    }

    if (status === "IN_PROGRESS") {
        return (
            <div className="space-y-2">
                <Button variant="outline" className="w-full cursor-default bg-blue-50 text-blue-700 hover:bg-blue-50 hover:text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Enrolled
                </Button>
                <Button
                    onClick={() => onUpdateStatus("COMPLETED")}
                    disabled={isLoading}
                    className="w-full"
                    variant="secondary"
                >
                    {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <CheckCircle className="mr-2 h-4 w-4" />
                    )}
                    Mark as Completed
                </Button>
            </div>
        )
    }

    return (
        <Button onClick={onEnroll} disabled={isLoading} className="w-full">
            {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <PlusCircle className="mr-2 h-4 w-4" />
            )}
            Enroll in Topic
        </Button>
    )
}
