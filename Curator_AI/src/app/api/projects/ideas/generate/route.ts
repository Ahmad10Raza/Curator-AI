import { getServerSession } from "next-auth"
import { authOptions } from "@/server/auth/auth-options"
import { NextResponse } from "next/server"
import { db } from "@/server/db"
import { generateProjectIdeas } from "@/server/ai/project-generator"
import { createProjects } from "@/server/services/project-service"

export async function POST() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        // Fetch user profile and topics
        const profile = await db.profile.findUnique({
            where: { userId: session.user.id }
        })

        const userTopics = await db.userTopic.findMany({
            where: {
                userId: session.user.id,
                status: { in: ["IN_PROGRESS", "COMPLETED"] }
            },
            include: { topic: true },
            take: 5,
            orderBy: { updatedAt: "desc" }
        })

        const topics = userTopics.map(ut => ut.topic.name)
        const level = profile?.experienceLevel || "Beginner"

        if (topics.length === 0) {
            return NextResponse.json({
                message: "No topics found",
                ideas: []
            })
        }

        const generatedIdeas = await generateProjectIdeas(topics, level)

        // Save to DB
        await createProjects(session.user.id, generatedIdeas.map(idea => ({
            ...idea,
            status: "IDEA"
        })))

        // Fetch updated list to return (including newly created ones)
        const allIdeas = await db.project.findMany({
            where: {
                userId: session.user.id,
                status: "IDEA"
            },
            orderBy: { createdAt: "desc" }
        })

        return NextResponse.json({ ideas: allIdeas })

    } catch (error) {
        console.error("[PROJECT_IDEAS_GENERATE]", error)
        return new NextResponse(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        })
    }
}
