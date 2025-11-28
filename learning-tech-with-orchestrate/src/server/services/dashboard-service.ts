import { db } from "@/server/db"

export const getDashboardStats = async (userId: string) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [dailyLog, userTopics, recentNotes] = await Promise.all([
        db.dailyLog.findUnique({
            where: {
                userId_date: {
                    userId,
                    date: today,
                },
            },
        }),
        db.userTopic.findMany({
            where: { userId },
            include: { topic: true },
        }),
        db.note.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            take: 5,
            include: { topic: true },
        }),
    ])

    const completedTopics = userTopics.filter((ut: { status: string }) => ut.status === "COMPLETED").length
    const inProgressTopics = userTopics.filter((ut: { status: string }) => ut.status === "IN_PROGRESS").length
    const notStartedTopics = userTopics.filter((ut: { status: string }) => ut.status === "NOT_STARTED").length

    // Calculate streak (simplified: count consecutive days with logs)
    // For MVP, we'll just return a mock streak or query past logs if needed.
    // Let's query last 7 days logs to estimate streak.
    const recentLogs = await db.dailyLog.findMany({
        where: {
            userId,
            date: {
                gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            },
        },
        orderBy: { date: "desc" },
    })

    let streak = 0
    // Logic to calculate streak would go here. For now, just count recent logs.
    streak = recentLogs.length

    return {
        stats: {
            topicsCount: userTopics.length,
            notesToday: dailyLog?.noteCount || 0,
            streak,
            completedTopics,
        },
        progress: {
            completed: completedTopics,
            inProgress: inProgressTopics,
            notStarted: notStartedTopics,
            total: userTopics.length,
        },
        recentNotes,
        continueLearning: userTopics
            .filter((ut: { status: string }) => ut.status === "IN_PROGRESS")
            .sort((a: { updatedAt: Date }, b: { updatedAt: Date }) => b.updatedAt.getTime() - a.updatedAt.getTime())
            .slice(0, 5),
    }
}
