import { db } from "@/server/db"
import OpenAI from "openai"

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

interface DailyActivityData {
    notes: Array<{
        content: string
        topicName: string
        createdAt: Date
    }>
    completedTopics: Array<{
        name: string
        category: string
    }>
    totalNotes: number
    totalTopicsCompleted: number
}

interface WeakArea {
    area: string
    count: number
    details: string
}

interface SummaryData {
    summary: string
    keyLearnings: string[]
    weakAreas: WeakArea[]
    suggestions: string[]
}

export async function generateDailySummary(userId: string, date: Date) {
    try {
        // Fetch daily activity
        const activityData = await analyzeDailyActivity(userId, date)

        // If no activity, skip summary generation
        if (activityData.totalNotes === 0 && activityData.totalTopicsCompleted === 0) {
            console.log(`No activity for user ${userId} on ${date.toISOString()}`)
            return null
        }

        // Generate summary using LLM
        const summaryData = await callLLMForSummary(activityData)

        // Save summary to database
        const savedSummary = await saveSummary(userId, date, summaryData, activityData)

        return savedSummary
    } catch (error) {
        console.error("Error generating daily summary:", error)
        throw error
    }
}

async function analyzeDailyActivity(userId: string, date: Date): Promise<DailyActivityData> {
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    // Fetch today's notes
    const notes = await db.note.findMany({
        where: {
            userId,
            createdAt: {
                gte: startOfDay,
                lte: endOfDay,
            },
        },
        include: {
            topic: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    })

    // Fetch topics completed today
    const completedTopics = await db.userTopic.findMany({
        where: {
            userId,
            status: "COMPLETED",
            updatedAt: {
                gte: startOfDay,
                lte: endOfDay,
            },
        },
        include: {
            topic: true,
        },
    })

    return {
        notes: notes.map(note => ({
            content: note.content,
            topicName: note.topic.name,
            createdAt: note.createdAt,
        })),
        completedTopics: completedTopics.map(ut => ({
            name: ut.topic.name,
            category: ut.topic.category || "General",
        })),
        totalNotes: notes.length,
        totalTopicsCompleted: completedTopics.length,
    }
}

async function callLLMForSummary(activityData: DailyActivityData): Promise<SummaryData> {
    const prompt = `You are an AI learning assistant analyzing a student's daily learning activity. Generate a personalized daily summary.

**Today's Activity:**
- Notes taken: ${activityData.totalNotes}
- Topics completed: ${activityData.totalTopicsCompleted}

**Notes Content:**
${activityData.notes.map((note, i) => `${i + 1}. [${note.topicName}]: ${note.content.substring(0, 200)}...`).join('\n')}

**Completed Topics:**
${activityData.completedTopics.map(t => `- ${t.name} (${t.category})`).join('\n')}

Based on this activity, provide:
1. A brief summary (2-3 sentences) of what the student learned today
2. 3-5 key concepts/learnings
3. Weak areas detected (topics mentioned frequently, areas with many questions, or concepts that seem unclear)
4. 2-3 actionable suggestions for tomorrow

Respond in JSON format:
{
  "summary": "string",
  "keyLearnings": ["string"],
  "weakAreas": [{"area": "string", "count": number, "details": "string"}],
  "suggestions": ["string"]
}`

    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: "You are a helpful learning assistant that provides concise, actionable insights.",
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
    if (!content) {
        throw new Error("No response from OpenAI")
    }

    return JSON.parse(content) as SummaryData
}

async function saveSummary(
    userId: string,
    date: Date,
    summaryData: SummaryData,
    activityData: DailyActivityData
) {
    const summaryDate = new Date(date)
    summaryDate.setHours(0, 0, 0, 0)

    return await db.dailySummary.upsert({
        where: {
            userId_date: {
                userId,
                date: summaryDate,
            },
        },
        update: {
            summary: summaryData.summary,
            keyLearnings: summaryData.keyLearnings,
            weakAreas: summaryData.weakAreas,
            suggestions: summaryData.suggestions,
            notesAnalyzed: activityData.totalNotes,
            topicsCompleted: activityData.totalTopicsCompleted,
        },
        create: {
            userId,
            date: summaryDate,
            summary: summaryData.summary,
            keyLearnings: summaryData.keyLearnings,
            weakAreas: summaryData.weakAreas,
            suggestions: summaryData.suggestions,
            notesAnalyzed: activityData.totalNotes,
            topicsCompleted: activityData.totalTopicsCompleted,
        },
    })
}

export async function getUserSummaries(userId: string, limit = 10, skip = 0) {
    return await db.dailySummary.findMany({
        where: { userId },
        orderBy: { date: "desc" },
        take: limit,
        skip,
    })
}
