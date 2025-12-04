"use client"

import { useCallback, useEffect, useState } from "react"
import ReactFlow, {
    Background,
    Controls,
    Edge,
    Node,
    useNodesState,
    useEdgesState,
    MarkerType,
} from "reactflow"
import "reactflow/dist/style.css"
import { Loader2 } from "lucide-react"

interface SkillNodeData {
    id: string
    name: string
    category: string
    status: "LOCKED" | "UNLOCKED" | "IN_PROGRESS" | "MASTERED"
    proficiency: number
}

const nodeColor = (status: string) => {
    switch (status) {
        case "MASTERED": return "#22c55e" // green-500
        case "IN_PROGRESS": return "#eab308" // yellow-500
        case "UNLOCKED": return "#3b82f6" // blue-500
        default: return "#94a3b8" // slate-400
    }
}

export function SkillGraph() {
    const [nodes, setNodes, onNodesChange] = useNodesState([])
    const [edges, setEdges, onEdgesChange] = useEdgesState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchGraph = async () => {
            try {
                const res = await fetch("/api/skills")
                const data = await res.json()

                if (data.nodes && data.edges) {
                    // Transform backend data to ReactFlow format
                    const flowNodes: Node[] = data.nodes.map((node: any, index: number) => ({
                        id: node.id,
                        data: { label: node.name, ...node },
                        position: { x: (index % 3) * 200, y: Math.floor(index / 3) * 150 }, // Simple grid layout
                        style: {
                            background: "#fff",
                            border: `2px solid ${nodeColor(node.status)}`,
                            borderRadius: "8px",
                            padding: "10px",
                            width: 150,
                            textAlign: "center",
                            fontSize: "12px",
                            fontWeight: "bold",
                        },
                    }))

                    const flowEdges: Edge[] = data.edges.map((edge: any) => ({
                        id: edge.id,
                        source: edge.fromNodeId,
                        target: edge.toNodeId,
                        type: "smoothstep",
                        markerEnd: {
                            type: MarkerType.ArrowClosed,
                        },
                        style: { stroke: "#94a3b8" },
                    }))

                    setNodes(flowNodes)
                    setEdges(flowEdges)
                }
            } catch (error) {
                console.error("Failed to load skill graph:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchGraph()
    }, [setNodes, setEdges])

    if (loading) {
        return (
            <div className="flex h-[500px] items-center justify-center border rounded-lg bg-muted/10">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <div className="h-[600px] border rounded-lg bg-slate-50 dark:bg-slate-900">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                fitView
            >
                <Background />
                <Controls />
            </ReactFlow>
        </div>
    )
}
