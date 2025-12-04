import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/server/auth/auth-options"
import { getQuizById } from "@/server/services/quiz-service"

export async function GET(
    req: Request,
    { params }: { params: { quizId: string } }
) {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const quiz = await getQuizById(params.quizId)
        if (!quiz) {
            return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
        }

        return NextResponse.json(quiz)
    } catch (error) {
        console.error("Error fetching quiz:", error)
        return NextResponse.json({ error: "Failed to fetch quiz" }, { status: 500 })
    }
}
