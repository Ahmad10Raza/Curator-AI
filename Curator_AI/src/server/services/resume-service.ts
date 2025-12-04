import { db } from "@/server/db"
import { ResumeProfile, JobRecommendation } from "@prisma/client"

export async function getResumeProfile(userId: string) {
    return await db.resumeProfile.findUnique({
        where: { userId },
    })
}

export async function updateResumeProfile(userId: string, data: Partial<{
    bio: string
    skills: string[]
    experience: any[]
    education: any[]
    projects: any[]
}>) {
    return await db.resumeProfile.upsert({
        where: { userId },
        update: data,
        create: {
            userId,
            bio: data.bio || "",
            skills: data.skills || [],
            experience: data.experience || [],
            education: data.education || [],
            projects: data.projects || [],
        },
    })
}

export async function getJobRecommendations(userId: string) {
    return await db.jobRecommendation.findMany({
        where: { userId },
        orderBy: { matchScore: "desc" },
    })
}

export async function saveJobRecommendations(userId: string, jobs: any[]) {
    // Clear old recommendations
    await db.jobRecommendation.deleteMany({ where: { userId } })

    // Save new ones
    return await db.jobRecommendation.createMany({
        data: jobs.map(job => ({
            userId,
            title: job.title,
            company: job.company,
            location: job.location,
            salary: job.salary,
            matchScore: job.matchScore,
            requirements: job.requirements,
            applyUrl: job.applyUrl,
        })),
    })
}
