import { getServerSession } from "next-auth"
import { authOptions } from "@/server/auth/auth-options"
import { NextResponse } from "next/server"
import { db } from "@/server/db"
import { parseResume } from "@/server/services/resume-parser"

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { text } = await req.json()
        if (!text) {
            return new NextResponse("Resume text is required", { status: 400 })
        }

        // Parse resume
        const parsedData = await parseResume(text)

        // Save to DB
        const resumeProfile = await db.resumeProfile.upsert({
            where: { userId: session.user.id },
            update: {
                summary: parsedData.summary,
                skills: parsedData.skills,
                experience: parsedData.experience as unknown as object,
                education: parsedData.education as unknown as object,
            },
            create: {
                userId: session.user.id,
                summary: parsedData.summary,
                skills: parsedData.skills,
                experience: parsedData.experience as unknown as object,
                education: parsedData.education as unknown as object,
            },
        })

        return NextResponse.json(resumeProfile)

    } catch (error) {
        console.error("[RESUME_UPLOAD]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
