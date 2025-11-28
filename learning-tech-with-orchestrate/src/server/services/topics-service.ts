import { db } from "@/server/db"

export const getTopics = async (
    search?: string,
    difficulty?: string,
    category?: string
) => {
    return await db.techTopic.findMany({
        where: {
            AND: [
                search
                    ? {
                        OR: [
                            { name: { contains: search } },
                            { description: { contains: search } },
                        ],
                    }
                    : {},
                difficulty ? { difficulty } : {},
                category ? { category } : {},
            ],
        },
        orderBy: {
            name: "asc",
        },
    })
}

export const getTopicById = async (id: string) => {
    return await db.techTopic.findUnique({
        where: {
            id,
        },
    })
}
