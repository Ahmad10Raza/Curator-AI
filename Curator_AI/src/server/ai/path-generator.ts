import OpenAI from "openai"

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

interface GeneratedPathStep {
    title: string
    description: string
    order: number
    resources: Array<{ title: string; url: string }>
}

interface GeneratedPath {
    title: string
    description: string
    category: string
    difficulty: string
    steps: GeneratedPathStep[]
}

export async function generateLearningPath(topic: string, goal: string, level: string): Promise<GeneratedPath> {
    const prompt = `Create a structured learning path for a student who wants to learn "${topic}" with the goal: "${goal}".
    Current level: ${level}.

    The path should be broken down into logical steps (modules).
    For each step, provide a title, a brief description of what to learn, and 2-3 high-quality resource links (documentation, tutorials, or videos).

    Respond in JSON format:
    {
        "title": "Path Title",
        "description": "Brief overview of the path",
        "category": "Category (e.g., Web Development, Data Science)",
        "difficulty": "BEGINNER | INTERMEDIATE | ADVANCED",
        "steps": [
            {
                "title": "Step Title",
                "description": "What to learn in this step",
                "order": 1,
                "resources": [
                    { "title": "Resource Name", "url": "https://..." }
                ]
            }
        ]
    }`

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are an expert curriculum designer creating personalized learning paths.",
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

        return JSON.parse(content) as GeneratedPath
    } catch (error) {
        console.error("Error generating learning path:", error)
        throw error
    }
}
