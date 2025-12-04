import { Metadata } from "next"
import { Shell } from "@/components/layout/Shell"
import { PathCard } from "@/components/paths/PathCard"
import { CreatePathDialog } from "@/components/paths/CreatePathDialog"
import { getLearningPaths } from "@/server/services/path-service"
import { getServerSession } from "next-auth"
import { authOptions } from "@/server/auth/auth-options"
import { db } from "@/server/db"

export const metadata: Metadata = {
    title: "Learning Paths",
    description: "Structured learning paths to help you master new skills.",
}

export default async function PathsPage() {
    const session = await getServerSession(authOptions)
    const paths = await getLearningPaths()

    // Get user's enrolled paths
    let userPathsMap = new Map()
    if (session?.user) {
        const userPaths = await db.userPath.findMany({
            where: { userId: session.user.id },
        })
        userPaths.forEach(up => userPathsMap.set(up.pathId, up))
    }

    return (
        <Shell>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Learning Paths</h1>
                        <p className="text-muted-foreground">
                            Structured curriculums to guide your learning journey.
                        </p>
                    </div>
                    <CreatePathDialog />
                </div>

                {paths.length === 0 ? (
                    <div className="text-center py-12 border border-dashed rounded-lg">
                        <h3 className="text-lg font-semibold mb-2">No paths found</h3>
                        <p className="text-muted-foreground mb-4">
                            Be the first to generate a learning path!
                        </p>
                        <CreatePathDialog />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {paths.map((path) => (
                            <PathCard
                                key={path.id}
                                path={path}
                                userPath={userPathsMap.get(path.id)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </Shell>
    )
}
