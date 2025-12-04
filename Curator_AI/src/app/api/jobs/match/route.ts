import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/server/auth/auth-options"
import { getResumeProfile, saveJobRecommendations, getJobRecommendations } from "@/server/services/resume-service"
import { findJobMatches } from "@/server/ai/resume-analyzer"

export async function GET(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const jobs = await getJobRecommendations(session.user.id)
        return NextResponse.json(jobs)
    } catch (error) {
        console.error("Error fetching jobs:", error)
        return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const profile = await getResumeProfile(session.user.id)
        if (!profile) {
            return NextResponse.json({ error: "Profile not found" }, { status: 404 })
        }

        const matches = await findJobMatches(profile)
        await saveJobRecommendations(session.user.id, matches)

        return NextResponse.json(matches)
    } catch (error) {
        console.error("Error finding job matches:", error)
        return NextResponse.json({ error: "Failed to find matches" }, { status: 500 })
    }
}
