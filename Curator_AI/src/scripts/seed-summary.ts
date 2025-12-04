import { db } from "@/server/db"

async function main() {
    console.log("Seeding test daily summary...")

    // Get the first user
    const user = await db.user.findFirst()
    if (!user) {
        console.error("No user found. Please create a user first.")
        return
    }

    console.log(`Found user: ${user.email} (${user.id})`)

    const date = new Date()
    date.setDate(date.getDate() - 1) // Yesterday
    date.setHours(0, 0, 0, 0)

    const summaryData = {
        summary: "Yesterday was a productive day focused on React fundamentals. You explored component lifecycle methods and state management, showing good grasp of basic hooks. However, there were some struggles with complex useEffect dependencies.",
        keyLearnings: [
            "Understanding React Component Lifecycle",
            "Mastering useState and useEffect hooks",
            "Props drilling vs Context API",
            "Conditional rendering patterns"
        ],
        weakAreas: [
            {
                area: "useEffect Dependencies",
                count: 3,
                details: "Multiple errors related to missing dependencies in useEffect arrays."
            },
            {
                area: "State Immutability",
                count: 2,
                details: "Attempted to mutate state directly instead of using setter functions."
            }
        ],
        suggestions: [
            "Review the official React docs on 'Synchronizing with Effects'",
            "Practice building a small counter app with complex state",
            "Try refactoring a component to use useReducer"
        ],
        notesAnalyzed: 5,
        topicsCompleted: 2
    }

    // Upsert the summary
    const summary = await db.dailySummary.upsert({
        where: {
            userId_date: {
                userId: user.id,
                date: date,
            },
        },
        update: summaryData,
        create: {
            userId: user.id,
            date: date,
            ...summaryData,
        },
    })

    console.log("Created/Updated Daily Summary:", summary)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await db.$disconnect()
    })
