import OpenAI from "openai"

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

interface GeneratedQuestion {
    question: string
    options: string[]
    correctIdx: number
    explanation: string
}

interface GeneratedQuiz {
    title: string
    questions: GeneratedQuestion[]
}

export async function generateQuiz(topic: string, difficulty: string, count: number = 5): Promise<GeneratedQuiz> {
    const prompt = `Create a ${difficulty} level quiz about "${topic}" with ${count} multiple-choice questions.

    For each question provide:
    1. The question text
    2. 4 options
    3. The index of the correct answer (0-3)
    4. A brief explanation of why the answer is correct

    Respond in JSON format:
    {
        "title": "Quiz Title",
        "questions": [
            {
                "question": "Question text?",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "correctIdx": 0,
                "explanation": "Explanation..."
            }
        ]
    }`

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are an expert teacher creating assessment quizzes.",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            response_format: { type: "json_object" },
            temperature: 0.7,
        })

        const content = response.choices[0].message.content
        if (!content) throw new Error("No response from OpenAI")

        return JSON.parse(content) as GeneratedQuiz
    } catch (error) {
        console.error("Error generating quiz:", error)
        throw error
    }
}
