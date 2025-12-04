import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/server/auth/auth-options"
import { createQuiz } from "@/server/services/quiz-service"
import { generateQuiz } from "@/server/ai/quiz-generator"

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const body = await req.json()
        const { topic, difficulty } = body

        if (!topic || !difficulty) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        // Generate quiz using AI
        const generatedQuiz = await generateQuiz(topic, difficulty)

        // Save to database
        const newQuiz = await createQuiz({
            title: generatedQuiz.title,
            questions: generatedQuiz.questions,
        })

        return NextResponse.json(newQuiz, { status: 201 })
    } catch (error) {
        console.error("Error generating quiz:", error)
        return NextResponse.json({ error: "Failed to generate quiz" }, { status: 500 })
    }
}
