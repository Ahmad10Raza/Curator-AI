"use client"

import { LearningPath, UserPath } from "@prisma/client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Trophy, Users } from "lucide-react"
import Link from "next/link"

interface PathCardProps {
    path: LearningPath & {
        _count?: {
            steps: number
            userPaths: number
        }
    }
    userPath?: UserPath | null
}

export function PathCard({ path, userPath }: PathCardProps) {
    return (
        <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
            <CardHeader>
                <div className="flex justify-between items-start mb-2">
                    <Badge variant={
                        path.difficulty === "BEGINNER" ? "default" :
                            path.difficulty === "INTERMEDIATE" ? "secondary" : "destructive"
                    }>
                        {path.difficulty}
                    </Badge>
                    {userPath && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            Enrolled
                        </Badge>
                    )}
                </div>
                <CardTitle className="line-clamp-1">{path.title}</CardTitle>
                <CardDescription className="line-clamp-2">{path.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{path._count?.steps || 0} Steps</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{path._count?.userPaths || 0} Students</span>
                    </div>
                </div>

                {userPath && (
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span className="font-medium">{userPath.progress}%</span>
                        </div>
                        <Progress value={userPath.progress} />
                    </div>
                )}
            </CardContent>
            <CardFooter>
                <Link href={`/paths/${path.id}`} className="w-full">
                    <Button className="w-full" variant={userPath ? "default" : "outline"}>
                        {userPath ? "Continue Learning" : "View Path"}
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    )
}
