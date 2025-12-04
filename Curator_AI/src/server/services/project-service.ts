import { db } from "@/server/db"
import { Project } from "@prisma/client"

export async function getUserProjects(userId: string) {
    return await db.project.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
    })
}

export async function getPublicProjects(userId: string) {
    return await db.project.findMany({
        where: {
            userId,
            isPublic: true,
        },
        orderBy: { createdAt: "desc" },
    })
}

export async function createProject(userId: string, data: {
    title: string
    description: string
    techStack: string[]
    githubUrl?: string
    demoUrl?: string
    difficulty?: string
    isPublic?: boolean
    status?: string
}) {
    return await db.project.create({
        data: {
            userId,
            ...data,
            status: data.status || "COMPLETED",
        },
    })
}

export async function createProjects(userId: string, projects: {
    title: string
    description: string
    techStack: string[]
    difficulty: string
    status: string
}[]) {
    return await db.project.createMany({
        data: projects.map(p => ({
            userId,
            ...p,
            isPublic: false, // Ideas are private by default
        }))
    })
}

export async function updateProject(projectId: string, userId: string, data: Partial<{
    title: string
    description: string
    techStack: string[]
    githubUrl: string
    demoUrl: string
    difficulty: string
    isPublic: boolean
    status: string
}>) {
    return await db.project.update({
        where: {
            id: projectId,
            userId, // Ensure ownership
        },
        data,
    })
}

export async function deleteProject(projectId: string, userId: string) {
    return await db.project.delete({
        where: {
            id: projectId,
            userId, // Ensure ownership
        },
    })
}

export async function addProjectMedia(projectId: string, userId: string, url: string, type: "IMAGE" | "VIDEO" = "IMAGE") {
    // Verify ownership first
    const project = await db.project.findUnique({
        where: { id: projectId, userId }
    })
    if (!project) throw new Error("Project not found or unauthorized")

    return await db.projectMedia.create({
        data: {
            projectId,
            url,
            type
        }
    })
}

export async function removeProjectMedia(mediaId: string, userId: string) {
    // Verify ownership via project
    const media = await db.projectMedia.findUnique({
        where: { id: mediaId },
        include: { project: true }
    })

    if (!media || media.project.userId !== userId) {
        throw new Error("Media not found or unauthorized")
    }

    return await db.projectMedia.delete({
        where: { id: mediaId }
    })
}
