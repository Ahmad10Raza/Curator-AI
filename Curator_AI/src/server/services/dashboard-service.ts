import { db } from "@/server/db"

export const getDashboardStats = async (userId: string) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    try {
        const [dailyLog, userTopics, recentNotes, allLogs] = await Promise.all([
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
            db.dailyLog.findMany({
                where: { userId },
                orderBy: { date: "desc" },
            }),
        ])

        const completedTopics = userTopics.filter((ut: { status: string }) => ut.status === "COMPLETED").length
        const inProgressTopics = userTopics.filter((ut: { status: string }) => ut.status === "IN_PROGRESS").length
        const notStartedTopics = userTopics.filter((ut: { status: string }) => ut.status === "NOT_STARTED").length

        // Calculate Streaks
        let currentStreak = 0
        let longestStreak = 0
        let tempStreak = 0
        let totalActiveDays = allLogs.length

        // Current Streak Calculation
        // Check if today has a log
        const hasLogToday = allLogs.some(log => log.date.getTime() === today.getTime())

        // If no log today, check if yesterday has a log to maintain streak
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)
        const hasLogYesterday = allLogs.some(log => log.date.getTime() === yesterday.getTime())

        if (hasLogToday || hasLogYesterday) {
            // Iterate backwards from today/yesterday to count consecutive days
            let checkDate = hasLogToday ? new Date(today) : new Date(yesterday)

            while (true) {
                const logExists = allLogs.some(log => log.date.getTime() === checkDate.getTime())
                if (logExists) {
                    currentStreak++
                    checkDate.setDate(checkDate.getDate() - 1)
                } else {
                    break
                }
            }
        }

        // Longest Streak Calculation
        // Sort logs by date ascending for easier iteration
        const sortedLogs = [...allLogs].sort((a, b) => a.date.getTime() - b.date.getTime())

        if (sortedLogs.length > 0) {
            tempStreak = 1
            longestStreak = 1

            for (let i = 1; i < sortedLogs.length; i++) {
                const prevDate = new Date(sortedLogs[i - 1].date)
                const currDate = new Date(sortedLogs[i].date)

                const diffTime = Math.abs(currDate.getTime() - prevDate.getTime())
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

                if (diffDays === 1) {
                    tempStreak++
                } else {
                    tempStreak = 1
                }

                if (tempStreak > longestStreak) {
                    longestStreak = tempStreak
                }
            }
        }

        // Activity Data (Last 30 Days)
        const activityData = []
        for (let i = 29; i >= 0; i--) {
            const d = new Date(today)
            d.setDate(d.getDate() - i)
            const log = allLogs.find(l => l.date.getTime() === d.getTime())

            activityData.push({
                date: d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }),
                count: log ? log.noteCount : 0,
                fullDate: d // Keep full date for sorting if needed
            })
        }

        // Heatmap Data (Last 365 Days)
        const heatmapData = []
        for (let i = 364; i >= 0; i--) {
            const d = new Date(today)
            d.setDate(d.getDate() - i)
            const log = allLogs.find(l => l.date.getTime() === d.getTime())

            heatmapData.push({
                date: d.toISOString().split('T')[0], // YYYY-MM-DD
                count: log ? log.noteCount : 0,
            })
        }

        return {
            stats: {
                topicsCount: userTopics.length,
                notesToday: dailyLog?.noteCount || 0,
                streak: currentStreak,
                longestStreak,
                totalActiveDays,
                completedTopics,
            },
            progress: {
                completed: completedTopics,
                inProgress: inProgressTopics,
                notStarted: notStartedTopics,
                total: userTopics.length,
            },
            activityData,
            heatmapData,
            recentNotes,
            continueLearning: userTopics
                .filter((ut: { status: string }) => ut.status === "IN_PROGRESS")
                .sort((a: { updatedAt: Date }, b: { updatedAt: Date }) => b.updatedAt.getTime() - a.updatedAt.getTime())
                .slice(0, 5),
        }
    } catch (error) {
        console.error("Error fetching dashboard stats:", error)
        return {
            stats: {
                topicsCount: 0,
                notesToday: 0,
                streak: 0,
                longestStreak: 0,
                totalActiveDays: 0,
                completedTopics: 0,
            },
            progress: {
                completed: 0,
                inProgress: 0,
                notStarted: 0,
                total: 0,
            },
            activityData: [],
            heatmapData: [],
            recentNotes: [],
            continueLearning: [],
        }
    }
}
