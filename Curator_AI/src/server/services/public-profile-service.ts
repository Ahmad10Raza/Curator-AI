import { db } from "@/server/db"

export async function getPublicProfile(userId: string) {
    return await db.publicPortfolioProfile.findUnique({
        where: { userId },
    })
}

export async function updatePublicProfile(userId: string, data: {
    username: string
    bio?: string
    tagline?: string
    showEmail?: boolean
}) {
    return await db.publicPortfolioProfile.upsert({
        where: { userId },
        create: {
            userId,
            ...data,
        },
        update: data,
    })
}

export async function getPortfolioByUsername(username: string) {
    const profile = await db.publicPortfolioProfile.findUnique({
        where: { username },
        include: {
            user: {
                select: {
                    name: true,
                    image: true,
                    email: true,
                }
            }
        }
    })

    if (!profile) return null

    const projects = await db.project.findMany({
        where: {
            userId: profile.userId,
            isPublic: true,
        },
        include: {
            media: true
        },
        orderBy: { createdAt: "desc" },
    })

    return {
        profile,
        projects,
        user: profile.user
    }
}
