import { db } from "@/server/db"

async function main() {
    console.log("Checking LearningPath access...")

    if (!db.learningPath) {
        console.error("ERROR: db.learningPath is undefined!")
        process.exit(1)
    }

    console.log("db.learningPath exists.")

    const count = await db.learningPath.count()
    console.log(`Found ${count} learning paths.`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await db.$disconnect()
    })
