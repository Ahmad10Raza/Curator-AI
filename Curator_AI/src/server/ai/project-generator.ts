import OpenAI from "openai"

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

interface ProjectIdea {
    title: string
    description: string
    techStack: string[]
    difficulty: string
}

export async function generateProjectIdeas(topics: string[], level: string): Promise<ProjectIdea[]> {
    const prompt = `Suggest 3 coding project ideas for a student learning: ${topics.join(", ")}.
    Current level: ${level}.
    
    The projects should be practical, portfolio-worthy, and help them practice the specified topics.
    
    For each project provide:
    1. A catchy title
    2. A brief description of what to build (2-3 sentences)
    3. The recommended tech stack (array of strings)
    4. Difficulty level (Beginner, Intermediate, Advanced)

    Respond in JSON format:
    {
        "ideas": [
            {
                "title": "Project Title",
                "description": "Description...",
                "techStack": ["React", "Node.js"],
                "difficulty": "Intermediate"
            }
        ]
    }`

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are a senior developer mentor suggesting portfolio projects. Your goal is to suggest projects that are challenging but achievable.",
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

        const result = JSON.parse(content)
        return result.ideas as ProjectIdea[]
    } catch (error) {
        console.error("Error generating project ideas:", error)
        // Return fallback ideas if AI fails
        return [
            {
                title: "Personal Task Manager",
                description: "Build a full-stack To-Do application with user authentication and data persistence.",
                techStack: topics.slice(0, 3),
                difficulty: level
            }
        ]
    }
}
