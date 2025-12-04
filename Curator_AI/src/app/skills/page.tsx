import { Metadata } from "next"
import { Shell } from "@/components/layout/Shell"
import { SkillGraph } from "@/components/skills/SkillGraph"
import { getServerSession } from "next-auth"
import { authOptions } from "@/server/auth/auth-options"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
    title: "Skill Graph",
    description: "Visualize your knowledge and track your progress.",
}

export default async function SkillsPage() {
    const session = await getServerSession(authOptions)
    if (!session?.user) redirect("/login")

    return (
        <Shell>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Skill Graph</h1>
                    <p className="text-muted-foreground">
                        Visualize your learning journey and discover new skills to master.
                    </p>
                </div>

                <div className="grid gap-6">
                    <SkillGraph />

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                            <span className="text-sm">Mastered</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-yellow-500" />
                            <span className="text-sm">In Progress</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500" />
                            <span className="text-sm">Unlocked</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-slate-400" />
                            <span className="text-sm">Locked</span>
                        </div>
                    </div>
                </div>
            </div>
        </Shell>
    )
}
