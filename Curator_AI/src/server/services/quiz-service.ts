import { db } from "@/server/db"
import { Quiz, QuizQuestion, QuizResult } from "@prisma/client"

export async function getQuizzes(topicId?: string) {
    return await db.quiz.findMany({
        where: {
            ...(topicId ? { topicId } : {}),
        },
        include: {
            _count: {
                select: { questions: true },
            },
        },
    })
}

export async function getQuizById(quizId: string) {
    return await db.quiz.findUnique({
        where: { id: quizId },
        include: {
            questions: true,
        },
    })
}

export async function submitQuizResult(userId: string, quizId: string, answers: Record<string, number>) {
    const quiz = await getQuizById(quizId)
    if (!quiz) throw new Error("Quiz not found")

    let score = 0
    quiz.questions.forEach(q => {
        if (answers[q.id] === q.correctIdx) {
            score++
        }
    })

    const finalScore = Math.round((score / quiz.questions.length) * 100)

    return await db.quizResult.create({
        data: {
            userId,
            quizId,
            score: finalScore,
            answers,
        },
    })
}

export async function createQuiz(data: {
    title: string
    topicId?: string
    questions: Array<{
        question: string
        options: string[]
        correctIdx: number
        explanation?: string
    }>
}) {
    return await db.quiz.create({
        data: {
            title: data.title,
            topicId: data.topicId,
            questions: {
                create: data.questions,
            },
        },
        include: {
            questions: true,
        },
    })
}
