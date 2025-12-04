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
            // Fetch existing resume
            const resumeProfile = await db.resumeProfile.findUnique({
                where: { userId: session.user.id }
            })

            if (!resumeProfile?.cleanJson) {
                return new NextResponse("No resume found to process", { status: 404 })
            }

            const currentResume = resumeProfile.cleanJson as unknown as ParsedResume

            if (action === "improve") {
                result = await improveResumeText(currentResume)
            } else if (action === "tailor" && role) {
                result = await createRoleSpecificResume(currentResume, role)
            } else {
                return new NextResponse("Invalid action or missing role", { status: 400 })
            }
        }

        // Update DB with the new version (optional: could store as a separate version or update main)
        // For now, let's just return it and let the frontend decide whether to save it as the "main" one via upload endpoint
        // Or we can update a specific field. Let's update 'roleSpecific' if tailoring.

        if (action === "tailor") {
            await db.resumeProfile.update({
                where: { userId: session.user.id },
                data: {
                    roleSpecific: result as unknown as object
                }
            })
        } else if (action === "improve" || action === "generate_from_learning") {
            await db.resumeProfile.upsert({
                where: { userId: session.user.id },
                update: {
                    cleanJson: result as unknown as object
                },
                create: {
                    userId: session.user.id,
                    cleanJson: result as unknown as object
                }
            })
        }

        return NextResponse.json(result)

    } catch (error) {
        console.error("[RESUME_GENERATE]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
