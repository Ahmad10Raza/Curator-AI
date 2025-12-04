import { createQuiz } from "@/server/services/quiz-service"
import { db } from "@/server/db"

async function main() {
    console.log("Testing createQuiz...")

    const mockQuizData = {
        title: "Test Quiz",
        questions: [
            {
                question: "What is 2 + 2?",
                options: ["3", "4", "5", "6"],
                correctIdx: 1,
                explanation: "Basic math."
            }
        ]
    }

    const quiz = await createQuiz(mockQuizData)

    console.log("Quiz created:", quiz.id)

    if (!quiz.questions || quiz.questions.length === 0) {
        console.error("ERROR: Quiz returned without questions!")
        process.exit(1)
    }

    console.log("SUCCESS: Quiz returned with", quiz.questions.length, "questions.")
    console.log("Question 1:", quiz.questions[0].question)

    // Cleanup
    await db.quiz.delete({ where: { id: quiz.id } })
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await db.$disconnect()
    })
