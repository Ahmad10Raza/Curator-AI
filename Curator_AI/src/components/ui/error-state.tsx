import { AlertTriangle, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorStateProps {
    title?: string
    message?: string
    retry?: () => void
}

export function ErrorState({
    title = "Something went wrong",
    message = "An error occurred while loading this content.",
    retry,
}: ErrorStateProps) {
    return (
        <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4 text-center">
            <div className="rounded-full bg-destructive/10 p-4">
                <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <div className="space-y-2">
                <h3 className="text-lg font-medium">{title}</h3>
                <p className="text-sm text-muted-foreground">{message}</p>
            </div>
            {retry && (
                <Button onClick={retry} variant="outline" className="gap-2">
                    <RefreshCcw className="h-4 w-4" />
                    Try Again
                </Button>
            )}
        </div>
    )
}
