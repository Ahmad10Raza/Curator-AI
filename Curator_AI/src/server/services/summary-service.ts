import { db } from "@/server/db"
import { openai } from "@/server/ai/openai-client"
import { DAILY_SUMMARY_SYSTEM_PROMPT } from "@/server/ai/prompts/daily-summary"
import { User } from "@prisma/client"

export const getTodayLearningData = async (userId: string) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const dailyLog = await db.dailyLog.findUnique({
        where: {
            userId_date: {
                userId,
                date: today,
            },
        },
    })

    const notes = await db.note.findMany({
        where: {
            userId,
            createdAt: {
                gte: today,
            },
        },
        include: {
            topic: true,
        },
    })

    return { dailyLog, notes }
}

export const generateDailySummary = async (user: User, data: any) => {
    const { notes } = data
    if (notes.length === 0) return null

    const topics = Array.from(new Set(notes.map((n: any) => n.topic.name))).join(", ")
    const notesContent = notes.map((n: any) => `- [${n.topic.name}]: ${n.content.substring(0, 100)}...`).join("\n")

    const systemPrompt = DAILY_SUMMARY_SYSTEM_PROMPT
        .replace("{{userName}}", user.name || "User")
        .replace("{{date}}", new Date().toDateString())
        .replace("{{topics}}", topics)
        .replace("{{notes}}", notesContent)

    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: "Please generate my daily summary." },
        ],
        temperature: 0.7,
    })

    return response.choices[0].message.content
}
