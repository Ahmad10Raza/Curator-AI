import { getServerSession } from "next-auth"
import { authOptions } from "@/server/auth/auth-options"
import { db } from "@/server/db"
import { NextResponse } from "next/server"

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        const { id } = await params
        const { status } = await req.json()

        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        if (!["NOT_STARTED", "IN_PROGRESS", "COMPLETED"].includes(status)) {
            return new NextResponse("Invalid status", { status: 400 })
        }

        const userTopic = await db.userTopic.updateMany({
            where: {
                userId: session.user.id,
                topicId: id,
            },
            data: {
                status,
            },
        })

        if (userTopic.count === 0) {
            return new NextResponse("Topic not found in user stack", { status: 404 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("[TOPIC_STATUS]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
