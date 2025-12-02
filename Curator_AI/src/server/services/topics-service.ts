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
                            { name: { contains: search, mode: 'insensitive' } },
                            { description: { contains: search, mode: 'insensitive' } },
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


export const getTopicFilters = async () => {
    const categories = await db.techTopic.findMany({
        select: { category: true },
        distinct: ['category'],
        where: { category: { not: null } }
    })

    const difficulties = await db.techTopic.findMany({
        select: { difficulty: true },
        distinct: ['difficulty'],
        where: { difficulty: { not: null } }
    })

    return {
        categories: categories.map(c => c.category).filter(Boolean) as string[],
        difficulties: difficulties.map(d => d.difficulty).filter(Boolean) as string[]
    }
}
