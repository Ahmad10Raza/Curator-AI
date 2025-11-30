"use client"

import { UserTopic, TechTopic } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface MyStackBoardProps {
    userTopics: (UserTopic & { topic: TechTopic })[]
}

export function MyStackBoard({ userTopics }: MyStackBoardProps) {
    const notStarted = userTopics.filter((ut) => ut.status === "NOT_STARTED")
    const inProgress = userTopics.filter((ut) => ut.status === "IN_PROGRESS")
    const completed = userTopics.filter((ut) => ut.status === "COMPLETED")

    return (
        <div className="grid gap-4 md:grid-cols-3">
            <StatusColumn title="Not Started" items={notStarted} />
            <StatusColumn title="In Progress" items={inProgress} />
            <StatusColumn title="Completed" items={completed} />
        </div>
    )
}

function StatusColumn({ title, items }: { title: string; items: (UserTopic & { topic: TechTopic })[] }) {
    return (
        <div className="space-y-4">
            <h3 className="font-semibold text-lg">{title} ({items.length})</h3>
            <div className="space-y-2">
                {items.map((item) => (
                    <Card key={item.id}>
                        <CardHeader className="p-4">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-base">
                                    <Link href={`/topics/${item.topicId}`} className="hover:underline">
                                        {item.topic.name}
                                    </Link>
                                </CardTitle>
                                <Badge variant="outline">{item.topic.difficulty}</Badge>
                            </div>
                        </CardHeader>
                    </Card>
                ))}
                {items.length === 0 && (
                    <div className="text-sm text-muted-foreground p-4 border border-dashed rounded-md text-center">
                        No topics
                    </div>
                )}
            </div>
        </div>
    )
}
