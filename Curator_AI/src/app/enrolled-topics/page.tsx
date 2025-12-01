import { Metadata } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/server/auth/auth-options"
import { redirect } from "next/navigation"
import { getUserStack } from "@/server/services/user-topics-service"
import { Shell } from "@/components/layout/Shell"
import { MyStackBoard } from "@/components/board/MyStackBoard"

export const metadata: Metadata = {
    title: "Enrolled Topics",
    description: "Your learning stack",
}

export default async function EnrolledTopicsPage() {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        redirect("/login")
    }

    const userStack = await getUserStack(session.user.id)

    return (
        <Shell>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Enrolled Topics</h1>
                    <p className="text-muted-foreground">
                        Track your progress across all your enrolled topics.
                    </p>
                </div>
                <div className="space-y-4">
                    <MyStackBoard userTopics={userStack} />
                </div>
            </div>
        </Shell>
    )
}
