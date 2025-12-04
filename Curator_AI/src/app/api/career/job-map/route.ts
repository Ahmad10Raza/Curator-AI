import { getServerSession } from "next-auth"
import { authOptions } from "@/server/auth/auth-options"
import { NextResponse } from "next/server"
import { db } from "@/server/db"
import { analyzeSkillGap } from "@/server/services/job-mapper"

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { role } = await req.json()
        if (!role) {
            return new NextResponse("Role is required", { status: 400 })
        }

        const analysis = await analyzeSkillGap(session.user.id, role)

        // Find resume profile to link recommendation
        const resumeProfile = await db.resumeProfile.findUnique({
            where: { userId: session.user.id }
        })

        if (!resumeProfile) {
            // Create a placeholder profile if it doesn't exist
            await db.resumeProfile.create({
                data: { userId: session.user.id }
            })
        }

        // Save recommendation
        // First get the resumeProfile id again to be sure
        const profile = await db.resumeProfile.findUniqueOrThrow({
            where: { userId: session.user.id }
        })

        await db.jobRecommendation.create({
            data: {
                resumeId: profile.id,
                userId: session.user.id,
                role: analysis.role,
                readiness: analysis.readinessScore,
                missingSkills: analysis.missingSkills,
                suggestedSteps: analysis.suggestedLearningPath as unknown as object
            }
        })

        return NextResponse.json(analysis)

    } catch (error) {
        console.error("[JOB_MAP]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
