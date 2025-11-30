import { db } from "@/server/db"
import { getTodayLearningData, generateDailySummary } from "@/server/services/summary-service"
import { sendDailySummaryEmail } from "@/server/email/email-client"

async function main() {
    console.log("Starting daily summary generation...")

    const users = await db.user.findMany()

    for (const user of users) {
        try {
            const data = await getTodayLearningData(user.id)

            // Only send if there's activity
            if (data.notes.length > 0) {
                console.log(`Generating summary for ${user.email}...`)
                const summary = await generateDailySummary(user, data)

                if (summary) {
                    await sendDailySummaryEmail(user.email!, summary)
                    console.log(`Summary sent to ${user.email}`)
                }
            }
        } catch (error) {
            console.error(`Failed to process user ${user.email}`, error)
        }
    }

    console.log("Daily summary generation complete.")
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await db.$disconnect()
    })
