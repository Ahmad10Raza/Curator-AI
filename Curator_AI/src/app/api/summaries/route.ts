import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/server/auth/auth-options"
import { generateDailySummary, getUserSummaries } from "@/server/services/ai-summary-service"

export async function GET(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const { searchParams } = new URL(req.url)
        const limit = parseInt(searchParams.get("limit") || "10")
        const skip = parseInt(searchParams.get("skip") || "0")

        const summaries = await getUserSummaries(session.user.id, limit, skip)
        return NextResponse.json(summaries)
    } catch (error) {
        console.error("Error fetching summaries:", error)
        return NextResponse.json({ error: "Failed to fetch summaries" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const body = await req.json()
        const date = body.date ? new Date(body.date) : new Date()

        const summary = await generateDailySummary(session.user.id, date)

        if (!summary) {
            return NextResponse.json({
                message: "No activity found for this date"
            }, { status: 200 })
        }

        return NextResponse.json(summary, { status: 201 })
    } catch (error) {
        console.error("Error generating summary:", error)
        return NextResponse.json({ error: "Failed to generate summary" }, { status: 500 })
    }
}
