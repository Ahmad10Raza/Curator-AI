import OpenAI from "openai"
import { db } from "@/server/db"
import { ParsedResume } from "./resume-parser"

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

export async function generateResumeFromLearning(userId: string) {
    // Fetch user data: profile, skills, projects, topics
    const profile = await db.profile.findUnique({ where: { userId } })
    const userSkills = await db.userSkill.findMany({
        where: { userId, status: { in: ["IN_PROGRESS", "MASTERED"] } },
        include: { skillNode: true }
    })
    const projects = await db.project.findMany({ where: { userId } })

    // Construct a resume object from platform data
    const resumeData = {
        fullName: profile?.displayName || "User",
        email: "", // Fetch from User model if needed, but Profile usually has it or User
        phone: "",
        summary: "A passionate learner building skills in full-stack development.",
        skills: userSkills.map(us => us.skillNode.name),
        projects: projects.map(p => ({
            name: p.title,
            description: p.description,
            techStack: p.techStack
        })),
        experience: [], // Platform doesn't track work experience yet
        education: []
    }

    return resumeData
}

export async function improveResumeText(currentResume: ParsedResume): Promise<ParsedResume> {
    const prompt = `
    Review and improve the following resume data.
    - Make the summary more professional and impactful.
    - Rewrite experience descriptions to use strong action verbs and STAR method where possible.
    - Organize skills logically.
    - Fix any grammar or spelling errors.

    Return the improved resume as a JSON object with the same structure.

    Current Resume:
    ${JSON.stringify(currentResume)}
    `

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are an expert resume writer and career coach.",
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

        return JSON.parse(content) as ParsedResume
    } catch (error) {
        console.error("Error improving resume:", error)
        throw new Error("Failed to improve resume")
    }
}

export async function createRoleSpecificResume(currentResume: ParsedResume, role: string): Promise<ParsedResume> {
    const prompt = `
    Tailor the following resume for the role of: ${role}.
    - Highlight skills and experiences relevant to ${role}.
    - Adjust the summary to focus on this career path.
    - Reorder projects or skills if necessary to emphasize relevance.

    Return the tailored resume as a JSON object with the same structure.

    Current Resume:
    ${JSON.stringify(currentResume)}
    `

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `You are an expert resume writer specializing in ${role} roles.`,
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

        return JSON.parse(content) as ParsedResume
    } catch (error) {
        console.error("Error tailoring resume:", error)
        throw new Error("Failed to tailor resume")
    }
}
