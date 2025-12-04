import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/server/auth/auth-options"
import { submitQuizResult } from "@/server/services/quiz-service"

export async function POST(
    req: Request,
    { params }: { params: { quizId: string } }
) {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const body = await req.json()
        const { answers } = body

        if (!answers) {
            return NextResponse.json({ error: "Missing answers" }, { status: 400 })
        }

        const result = await submitQuizResult(session.user.id, params.quizId, answers)
        return NextResponse.json(result, { status: 201 })
    } catch (error) {
        console.error("Error submitting quiz:", error)
        return NextResponse.json({ error: "Failed to submit quiz" }, { status: 500 })
    }
}
