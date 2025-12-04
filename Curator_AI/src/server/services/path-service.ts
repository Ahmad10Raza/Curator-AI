import { db } from "@/server/db"
import { LearningPath, PathStep, UserPath } from "@prisma/client"

export async function getLearningPaths(category?: string) {
    return await db.learningPath.findMany({
        where: {
            isPublic: true,
            ...(category ? { category } : {}),
        },
        include: {
            _count: {
                select: { steps: true, userPaths: true },
            },
        },
    })
}

export async function getLearningPathById(pathId: string) {
    if (!pathId) return null
    return await db.learningPath.findUnique({
        where: { id: pathId },
        include: {
            steps: {
                orderBy: { order: "asc" },
            },
        },
    })
}

export async function getUserPathProgress(userId: string, pathId: string) {
    return await db.userPath.findUnique({
        where: {
            userId_pathId: {
                userId,
                pathId,
            },
        },
    })
}

export async function enrollUserInPath(userId: string, pathId: string) {
    return await db.userPath.create({
        data: {
            userId,
            pathId,
            status: "IN_PROGRESS",
            progress: 0,
        },
    })
}

export async function updatePathProgress(userId: string, pathId: string, completedStepId: string) {
    const userPath = await getUserPathProgress(userId, pathId)
    if (!userPath) throw new Error("User not enrolled in this path")

    // Avoid duplicates
    if (userPath.completedSteps.includes(completedStepId)) return userPath

    const updatedCompletedSteps = [...userPath.completedSteps, completedStepId]

    // Calculate new progress percentage
    const path = await db.learningPath.findUnique({
        where: { id: pathId },
        include: { steps: true },
    })

    if (!path) throw new Error("Path not found")

    const totalSteps = path.steps.length
    const progress = Math.round((updatedCompletedSteps.length / totalSteps) * 100)
    const status = progress === 100 ? "COMPLETED" : "IN_PROGRESS"

    return await db.userPath.update({
        where: { id: userPath.id },
        data: {
            completedSteps: updatedCompletedSteps,
            progress,
            status,
        },
    })
}

export async function createLearningPath(data: {
    title: string
    description: string
    category: string
    difficulty: string
    creatorId?: string
    isPublic?: boolean
    steps: Array<{
        title: string
        description: string
        order: number
        resources?: any
    }>
}) {
    return await db.learningPath.create({
        data: {
            title: data.title,
            description: data.description,
            category: data.category,
            difficulty: data.difficulty,
            creatorId: data.creatorId,
            isPublic: data.isPublic ?? false,
            steps: {
                create: data.steps.map(step => ({
                    title: step.title,
                    description: step.description,
                    order: step.order,
                    resources: step.resources,
                })),
            },
        },
    })
}
