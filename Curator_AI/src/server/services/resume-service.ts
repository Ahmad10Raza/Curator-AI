import { db } from "@/server/db"
import { ResumeProfile, JobRecommendation } from "@prisma/client"

export async function getResumeProfile(userId: string) {
    return await db.resumeProfile.findUnique({
        where: { userId },
    })
}

export async function updateResumeProfile(userId: string, data: Partial<{
    summary: string
    skills: string[]
    experience: any[]
    education: any[]
}>) {
    return await db.resumeProfile.upsert({
        where: { userId },
        update: data,
        create: {
            userId,
            summary: data.summary || "",
            skills: data.skills || [],
            experience: data.experience as unknown as object || {},
            education: data.education as unknown as object || {},
        },
    })
}

export async function getJobRecommendations(userId: string) {
    return await db.jobRecommendation.findMany({
        where: { userId },
        orderBy: { readiness: "desc" },
    })
}

export async function saveJobRecommendations(userId: string, resumeId: string, jobs: any[]) {
    // Clear old recommendations
    await db.jobRecommendation.deleteMany({ where: { userId } })

    // Save new ones
    return await db.jobRecommendation.createMany({
        data: jobs.map(job => ({
            userId,
            resumeId,
            role: job.role || job.title,
            company: job.company || null,
            location: job.location || null,
            readiness: job.readiness || job.matchScore || 0,
            missingSkills: job.missingSkills || [],
            suggestedSteps: job.suggestedSteps as unknown as object || {},
            applyLink: job.applyLink || job.applyUrl || null,
        })),
    })
}
