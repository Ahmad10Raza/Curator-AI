import { db } from "@/server/db"

export const getUserStack = async (userId: string) => {
    return await db.userTopic.findMany({
        where: {
            userId,
        },
        include: {
            topic: true,
        },
    })
}

export const addTopicToUser = async (userId: string, topicId: string) => {
    return await db.userTopic.create({
        data: {
            userId,
            topicId,
            status: "NOT_STARTED",
        },
    })
}

export const updateUserTopicStatus = async (userTopicId: string, status: string) => {
    return await db.userTopic.update({
        where: {
            id: userTopicId,
        },
        data: {
            status,
        },
    })
}
