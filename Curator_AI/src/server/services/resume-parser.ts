import OpenAI from "openai"

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

export interface ParsedResume {
    fullName: string
    email: string
    phone: string
    summary: string
    skills: string[]
    experience: {
        title: string
        company: string
        startDate: string
        endDate: string
        description: string
    }[]
    education: {
        degree: string
        school: string
        year: string
    }[]
    projects: {
        name: string
        description: string
        techStack: string[]
    }[]
}

export async function parseResume(text: string): Promise<ParsedResume> {
    const prompt = `
    Extract structured data from the following resume text.
    Return a JSON object with the following fields:
    - fullName
    - email
    - phone
    - summary (brief professional summary)
    - skills (array of strings)
    - experience (array of objects: title, company, startDate, endDate, description)
    - education (array of objects: degree, school, year)
    - projects (array of objects: name, description, techStack)

    Resume Text:
    ${text.slice(0, 10000)} // Limit text length to avoid token limits
    `

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are a precise resume parser. Extract data accurately.",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            response_format: { type: "json_object" },
            temperature: 0,
        })

        const content = response.choices[0].message.content
        if (!content) throw new Error("No response from OpenAI")

        return JSON.parse(content) as ParsedResume
    } catch (error) {
        console.error("Error parsing resume:", error)
        throw new Error("Failed to parse resume")
    }
}
