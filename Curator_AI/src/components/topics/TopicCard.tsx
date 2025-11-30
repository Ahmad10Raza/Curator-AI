import Link from "next/link"
import { TechTopic } from "@prisma/client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface TopicCardProps {
    topic: TechTopic
}

export function TopicCard({ topic }: TopicCardProps) {
    return (
        <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
                <div className="flex justify-between items-start gap-2">
                    <CardTitle className="line-clamp-1">{topic.name}</CardTitle>
                    <Badge variant={topic.difficulty === "BEGINNER" ? "secondary" : topic.difficulty === "INTERMEDIATE" ? "default" : "destructive"}>
                        {topic.difficulty}
                    </Badge>
                </div>
                <CardDescription className="line-clamp-2">
                    {topic.description}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
                <Badge variant="outline">{topic.category}</Badge>
            </CardContent>
            <CardFooter>
                <Link href={`/topics/${topic.id}`} className="w-full">
                    <Button className="w-full">View Topic</Button>
                </Link>
            </CardFooter>
        </Card>
    )
}
