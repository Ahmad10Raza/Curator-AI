import { db } from "@/server/db"
import { SkillNode, SkillEdge, UserSkill } from "@prisma/client"

export async function getSkillGraph(userId?: string) {
    if (!userId) {
        const nodes = await db.skillNode.findMany()
        const edges = await db.skillEdge.findMany()
        return {
            nodes: nodes.map((node: SkillNode) => ({
                ...node,
                status: "LOCKED",
                proficiency: 0,
            })),
            edges,
        }
    }

    // Fetch enrolled topics (IN_PROGRESS or COMPLETED)
    const userTopics = await db.userTopic.findMany({
        where: {
            userId,
            status: { in: ["IN_PROGRESS", "COMPLETED"] },
        },
        include: { topic: true },
    })

    const enrolledTopicNames = userTopics.map(ut => ut.topic.name.toLowerCase())

    // Fetch user skills
    const userSkills = await db.userSkill.findMany({
        where: { userId },
    })

    // Fetch all nodes and edges
    const allNodes = await db.skillNode.findMany()
    const allEdges = await db.skillEdge.findMany()

    // Filter nodes: Include if enrolled in topic (fuzzy match) OR has active user skill
    const matchedNodes = allNodes.filter((node: SkillNode) => {
        const isEnrolled = enrolledTopicNames.some(topicName =>
            topicName.includes(node.name.toLowerCase()) || node.name.toLowerCase().includes(topicName)
        )
        const hasActiveSkill = userSkills.some((us: UserSkill) =>
            us.skillNodeId === node.id &&
            (us.status === "IN_PROGRESS" || us.status === "MASTERED")
        )
        return isEnrolled || hasActiveSkill
    })

    // Identify topics that didn't match any existing SkillNode
    const matchedNodeNames = new Set<string>(matchedNodes.map((n: SkillNode) => n.name.toLowerCase()))
    const unmatchedTopics = userTopics.filter(ut => {
        const topicName = ut.topic.name.toLowerCase()
        // Check if this topic name was "covered" by any matched node
        return !Array.from(matchedNodeNames).some((nodeName: string) =>
            topicName.includes(nodeName) || nodeName.includes(topicName)
        )
    })

    // Create virtual nodes for unmatched topics
    const virtualNodes = unmatchedTopics.map(ut => ({
        id: ut.topic.id, // Use topic ID as node ID
        name: ut.topic.name,
        category: ut.topic.category || "Uncategorized",
        description: ut.topic.description,
        parentId: null,
        status: ut.status === "COMPLETED" ? "MASTERED" : "IN_PROGRESS",
        proficiency: ut.progressPercent,
    }))

    const finalNodes = [...matchedNodes, ...virtualNodes]
    const finalNodeIds = new Set(finalNodes.map((n: any) => n.id))

    // Filter edges: Only if both nodes are present
    const filteredEdges = allEdges.filter((edge: SkillEdge) =>
        finalNodeIds.has(edge.fromNodeId) && finalNodeIds.has(edge.toNodeId)
    )

    // Map matched nodes with status
    const nodesWithStatus = matchedNodes.map((node: SkillNode) => {
        const userSkill = userSkills.find((us: UserSkill) => us.skillNodeId === node.id)
        // Find related topic for status sync
        const userTopic = userTopics.find(ut =>
            ut.topic.name.toLowerCase().includes(node.name.toLowerCase()) ||
            node.name.toLowerCase().includes(ut.topic.name.toLowerCase())
        )

        let status = userSkill?.status || "LOCKED"
        let proficiency = userSkill?.proficiency || 0

        // Sync status from UserTopic
        if (userTopic) {
            const topicStatus = userTopic.status === "COMPLETED" ? "MASTERED" : "IN_PROGRESS"
            if (!userSkill || (status === "LOCKED" || status === "UNLOCKED")) {
                status = topicStatus
                proficiency = userTopic.progressPercent
            }
        }

        return {
            ...node,
            status,
            proficiency,
        }
    })

    return {
        nodes: [...nodesWithStatus, ...virtualNodes],
        edges: filteredEdges,
    }
}

export async function updateUserSkill(userId: string, skillNodeId: string, proficiency: number) {
    const status = proficiency >= 100 ? "MASTERED" : proficiency > 0 ? "IN_PROGRESS" : "UNLOCKED"

    return await db.userSkill.upsert({
        where: {
            userId_skillNodeId: {
                userId,
                skillNodeId,
            },
        },
        update: {
            proficiency,
            status,
            lastPracticed: new Date(),
        },
        create: {
            userId,
            skillNodeId,
            proficiency,
            status,
            lastPracticed: new Date(),
        },
    })
}

export async function initializeSkillGraph() {
    // Check if graph is empty
    const count = await db.skillNode.count()
    if (count > 0) return

    // Seed basic web dev graph
    const nodes = [
        { name: "Web Development", category: "Root", description: "The root of web dev" },
        { name: "HTML", category: "Frontend", description: "Structure of web pages" },
        { name: "CSS", category: "Frontend", description: "Styling of web pages" },
        { name: "JavaScript", category: "Language", description: "Logic of web pages" },
        { name: "React", category: "Frontend", description: "UI Library" },
        { name: "Node.js", category: "Backend", description: "JS Runtime" },
        { name: "Database", category: "Backend", description: "Data storage" },
        { name: "SQL", category: "Backend", description: "Structured Query Language" },
        { name: "API", category: "Backend", description: "Application Programming Interface" },
    ]

    const createdNodes: any[] = []
    for (const node of nodes) {
        const created = await db.skillNode.create({ data: node })
        createdNodes.push(created)
    }

    const getNode = (name: string) => createdNodes.find(n => n.name === name)!

    const edges = [
        { from: "Web Development", to: "HTML" },
        { from: "Web Development", to: "CSS" },
        { from: "Web Development", to: "JavaScript" },
        { from: "HTML", to: "React" },
        { from: "CSS", to: "React" },
        { from: "JavaScript", to: "React" },
        { from: "JavaScript", to: "Node.js" },
        { from: "Node.js", to: "API" },
        { from: "Database", to: "SQL" },
        { from: "SQL", to: "API" },
    ]

    for (const edge of edges) {
        await db.skillEdge.create({
            data: {
                fromNodeId: getNode(edge.from).id,
                toNodeId: getNode(edge.to).id,
                type: "DEPENDENCY",
            },
        })
    }
}
