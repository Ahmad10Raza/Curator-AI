import { Shell } from "@/components/layout/Shell"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Construction } from "lucide-react"

export default function ResumePage() {
    return (
        <Shell>
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
                <div className="p-4 rounded-full bg-muted">
                    <Construction className="h-12 w-12 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Coming Soon</h1>
                    <p className="text-muted-foreground max-w-[600px]">
                        We are working hard to bring you a powerful Resume Editor directly within Curator AI.
                        In the meantime, you can use the external Markdown Resume Editor.
                    </p>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" asChild>
                        <Link href="/career">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Career
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href="https://markdownresume.app/editor/" target="_blank" rel="noopener noreferrer">
                            Open External Editor
                        </Link>
                    </Button>
                </div>
            </div>
        </Shell>
    )
}
