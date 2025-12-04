import { getSkillGraph } from "@/server/services/skill-service"
import { db } from "@/server/db"

async function main() {
    console.log("Testing getSkillGraph filtering...")

    // 1. Create a test user
    const user = await db.user.create({
        data: {
            name: "Skill Graph Tester",
            email: "skilltest@example.com",
        }
    })
    console.log("Created user:", user.id)

    // 2. Create some topics and skills
    // Assuming seed data exists or we create some
    const topic = await db.techTopic.create({
        data: { name: "TestTopic_React" }
    })

    const skillNode = await db.skillNode.create({
        data: { name: "TestTopic_React", category: "Frontend" }
    })

    const otherNode = await db.skillNode.create({
        data: { name: "TestTopic_Angular", category: "Frontend" }
    })

    // 3. Enroll user in topic
    await db.userTopic.create({
        data: {
            userId: user.id,
            topicId: topic.id,
            status: "IN_PROGRESS"
        }
    })

    // 4. Get graph
    const graph = await getSkillGraph(user.id)

    console.log("Graph nodes:", graph.nodes.map(n => n.name))

    const hasReact = graph.nodes.some(n => n.name === "TestTopic_React")
    const hasAngular = graph.nodes.some(n => n.name === "TestTopic_Angular")

    if (hasReact && !hasAngular) {
        console.log("SUCCESS: Graph correctly filtered to enrolled topic.")
    } else {
        console.error("FAILURE: Graph filtering incorrect.", { hasReact, hasAngular })
        process.exit(1)
    }

    // Cleanup
    await db.userTopic.deleteMany({ where: { userId: user.id } })
    await db.user.delete({ where: { id: user.id } })
    await db.skillNode.delete({ where: { id: skillNode.id } })
    await db.skillNode.delete({ where: { id: otherNode.id } })
    await db.techTopic.delete({ where: { id: topic.id } })
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await db.$disconnect()
    })
