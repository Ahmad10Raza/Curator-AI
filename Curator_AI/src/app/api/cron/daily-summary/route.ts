import { NextResponse } from "next/server"
import { db } from "@/server/db"
import { generateDailySummary } from "@/server/services/ai-summary-service"
import { sendDailySummaryEmail } from "@/server/services/email-service"

export async function GET(req: Request) {
    try {
        // Verify cron secret for security
        const authHeader = req.headers.get("authorization")
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        yesterday.setHours(0, 0, 0, 0)

        // Get all users
        const users = await db.user.findMany({
            where: {
                email: {
                    not: null,
                },
            },
            select: {
                id: true,
                email: true,
                name: true,
            },
        })

        const results = []

        for (const user of users) {
            try {
                // Generate summary for yesterday
                const summary = await generateDailySummary(user.id, yesterday)

                if (summary && user.email) {
                    // Send email
                    await sendDailySummaryEmail(
                        user.email,
                        user.name || "there",
                        summary
                    )

                    results.push({
                        userId: user.id,
                        status: "success",
                        summaryId: summary.id,
                    })
                } else {
                    results.push({
                        userId: user.id,
                        status: "no_activity",
                    })
                }
            } catch (error) {
                console.error(`Error processing user ${user.id}:`, error)
                results.push({
                    userId: user.id,
                    status: "error",
                    error: error instanceof Error ? error.message : "Unknown error",
                })
            }
        }

        return NextResponse.json({
            success: true,
            date: yesterday.toISOString(),
            processed: users.length,
            results,
        })
    } catch (error) {
        console.error("Cron job error:", error)
        return NextResponse.json(
            { error: "Cron job failed", details: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        )
    }
}
