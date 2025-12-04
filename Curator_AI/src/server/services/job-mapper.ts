import OpenAI from "openai"
import { db } from "@/server/db"

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

interface SkillGapAnalysis {
    role: string
    readinessScore: number // 0-100
    missingSkills: string[]
    matchedSkills: string[]
    suggestedLearningPath: string[]
}

export async function analyzeSkillGap(userId: string, targetRole: string): Promise<SkillGapAnalysis> {
    // Fetch user skills and projects
    const userSkills = await db.userSkill.findMany({
        where: { userId, status: { in: ["IN_PROGRESS", "MASTERED"] } },
        include: { skillNode: true }
    })
    const projects = await db.project.findMany({ where: { userId } })

    const userProfileSummary = {
        skills: userSkills.map(us => us.skillNode.name),
        projects: projects.map(p => ({
            title: p.title,
            techStack: p.techStack
        }))
    }

    const prompt = `
    Analyze the following user profile against the requirements for the role of: ${targetRole}.
    
    User Profile:
    ${JSON.stringify(userProfileSummary)}

    Provide a detailed analysis in JSON format:
    {
        "role": "${targetRole}",
        "readinessScore": 0-100 (integer estimate based on skills match),
        "missingSkills": ["Skill 1", "Skill 2"],
        "matchedSkills": ["Skill A", "Skill B"],
        "suggestedLearningPath": ["Step 1: Learn X", "Step 2: Build Y"]
    }
    `

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are a career counselor and technical recruiter.",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            response_format: { type: "json_object" },
            temperature: 0.5,
        })

        const content = response.choices[0].message.content
        if (!content) throw new Error("No response from OpenAI")

        return JSON.parse(content) as SkillGapAnalysis
    } catch (error) {
        console.error("Error analyzing skill gap:", error)
        throw new Error("Failed to analyze skill gap")
    }
}
