import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/server/auth/auth-options"
import { getResumeProfile } from "@/server/services/resume-service"
import { analyzeResume } from "@/server/ai/resume-analyzer"

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

        const analysis = await analyzeResume(profile)
        return NextResponse.json(analysis)
    } catch (error) {
        console.error("Error analyzing resume:", error)
        return NextResponse.json({ error: "Failed to analyze resume" }, { status: 500 })
    }
}
