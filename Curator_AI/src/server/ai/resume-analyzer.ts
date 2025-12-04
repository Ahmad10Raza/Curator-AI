import OpenAI from "openai"

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

interface AnalyzedResume {
    feedback: string
    missingSkills: string[]
    suggestedRoles: string[]
}

interface JobMatch {
    title: string
    company: string
    location: string
    salary: string
    matchScore: number
    requirements: string[]
    applyUrl: string
}

export async function analyzeResume(profile: any): Promise<AnalyzedResume> {
    const prompt = `Analyze this developer profile and provide feedback.
    
    Profile:
    ${JSON.stringify(profile, null, 2)}

    Provide:
    1. Constructive feedback on how to improve the resume
    2. Missing skills that would increase employability
    3. Suggested job roles based on current skills

    Respond in JSON format:
    {
        "feedback": "Feedback text...",
        "missingSkills": ["Skill 1", "Skill 2"],
        "suggestedRoles": ["Role 1", "Role 2"]
    }`

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are an expert tech recruiter and career coach.",
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

        return JSON.parse(content) as AnalyzedResume
    } catch (error) {
        console.error("Error analyzing resume:", error)
        throw error
    }
}

export async function findJobMatches(profile: any): Promise<JobMatch[]> {
    // In a real app, this would search a job API.
    // For now, we'll generate realistic mock jobs based on the profile using AI.

    const prompt = `Generate 5 realistic job postings that would be a good match for this developer profile.
    
    Profile:
    ${JSON.stringify(profile, null, 2)}

    For each job provide:
    1. Job Title
    2. Company Name (fictional or real tech companies)
    3. Location (Remote or major tech hubs)
    4. Estimated Salary Range
    5. Match Score (0-100) based on profile fit
    6. Key Requirements
    7. A mock Apply URL

    Respond in JSON format:
    {
        "jobs": [
            {
                "title": "Frontend Engineer",
                "company": "TechCorp",
                "location": "Remote",
                "salary": "$100k - $130k",
                "matchScore": 85,
                "requirements": ["React", "TypeScript"],
                "applyUrl": "https://..."
            }
        ]
    }`

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are a job matching engine.",
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
        return result.jobs as JobMatch[]
    } catch (error) {
        console.error("Error finding job matches:", error)
        throw error
    }
}
