import { db } from "@/server/db"

export const createNote = async (userId: string, topicId: string, content: string) => {
    // Transaction to create note and update daily log
    return await db.$transaction(async (tx) => {
        const note = await tx.note.create({
            data: {
                userId,
                topicId,
                content,
            },
        })

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        // Upsert daily log
        await tx.dailyLog.upsert({
            where: {
                userId_date: {
                    userId,
                    date: today,
                },
            },
            update: {
                noteCount: {
                    increment: 1,
                },
                topicsTouched: {
                    increment: 1, // Simplified logic: incrementing even if topic already touched today
                },
            },
            create: {
                userId,
                date: today,
                noteCount: 1,
                topicsTouched: 1,
            },
        })

        return note
    })
}

export const getNotesForTopic = async (userId: string, topicId: string) => {
    return await db.note.findMany({
        where: {
            userId,
            topicId,
        },
        orderBy: {
            createdAt: "desc",
        },
    })
}

export const getRecentNotes = async (userId: string) => {
    return await db.note.findMany({
        where: {
            userId,
        },
        orderBy: {
            createdAt: "desc",
        },
        take: 5,
        include: {
            topic: true
        }
    })
}
