import { getServerSession } from "next-auth"
import { authOptions } from "@/server/auth/auth-options"
import { NextResponse } from "next/server"
import { db } from "@/server/db"
import { generateResumeFromLearning, improveResumeText, createRoleSpecificResume } from "@/server/services/resume-builder"
import { ParsedResume } from "@/server/services/resume-parser"

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { action, role } = await req.json() // action: 'generate_from_learning' | 'improve' | 'tailor'

        let result: ParsedResume

        if (action === "generate_from_learning") {
            result = await generateResumeFromLearning(session.user.id) as ParsedResume
        } else {
            // For improve/tailor, we need existing resume data
            // Since we don't have cleanJson, just return error for now
            return new NextResponse("Feature not yet implemented. Please use 'generate_from_learning' action.", { status: 400 })
        }

        // Save generated resume
        await db.resumeProfile.upsert({
            where: { userId: session.user.id },
            update: {
                summary: result.summary,
                skills: result.skills,
                experience: result.experience as unknown as object,
                education: result.education as unknown as object,
            },
            create: {
                userId: session.user.id,
                summary: result.summary,
                skills: result.skills,
                experience: result.experience as unknown as object,
                education: result.education as unknown as object,
            }
        })

        return NextResponse.json(result)

    } catch (error) {
        console.error("[RESUME_GENERATE]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
