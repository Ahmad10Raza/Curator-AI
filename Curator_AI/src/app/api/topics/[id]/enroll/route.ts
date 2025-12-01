import { getServerSession } from "next-auth"
import { authOptions } from "@/server/auth/auth-options"
import { db } from "@/server/db"
import { NextResponse } from "next/server"

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        const { id } = await params

        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        // Check if already enrolled
        const existing = await db.userTopic.findFirst({
            where: {
                userId: session.user.id,
                topicId: id,
            },
        })

        if (existing) {
            return new NextResponse("Already enrolled", { status: 400 })
        }

        const userTopic = await db.userTopic.create({
            data: {
                userId: session.user.id,
                topicId: id,
                status: "IN_PROGRESS", // Auto-start when enrolling
            },
        })

        return NextResponse.json(userTopic)
    } catch (error) {
        console.error("[TOPIC_ENROLL]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
