import { getServerSession } from "next-auth"
import { authOptions } from "@/server/auth/auth-options"
import { NextResponse } from "next/server"
import { db } from "@/server/db"

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const resumeProfile = await db.resumeProfile.findUnique({
            where: { userId: session.user.id },
            include: {
                recommendations: {
                    orderBy: { createdAt: "desc" }
                }
            }
        })

        if (!resumeProfile) {
            return NextResponse.json({ recommendations: [] })
        }

        return NextResponse.json({ recommendations: resumeProfile.recommendations })

    } catch (error) {
        console.error("[CAREER_JOBS]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
