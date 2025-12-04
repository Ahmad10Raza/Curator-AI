"use client"

import { DailySummary } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { ChevronDown, ChevronRight, Calendar, FileText, Target, AlertCircle } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface SummaryCardProps {
    summary: DailySummary
}

interface WeakArea {
    area: string
    count: number
    details: string
}

export function SummaryCard({ summary }: SummaryCardProps) {
    const [isExpanded, setIsExpanded] = useState(false)
    const weakAreas = summary.weakAreas as WeakArea[]

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <CardTitle className="text-lg">
                                {new Date(summary.date).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </CardTitle>
                        </div>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <FileText className="h-3 w-3" />
                                {summary.notesAnalyzed} notes
                            </span>
                            <span className="flex items-center gap-1">
                                <Target className="h-3 w-3" />
                                {summary.topicsCompleted} topics completed
                            </span>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                        ) : (
                            <ChevronRight className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <h4 className="font-semibold mb-2">Summary</h4>
                    <p className="text-sm text-muted-foreground">{summary.summary}</p>
                </div>

                {isExpanded && (
                    <>
                        <div>
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                                <span>✨</span> Key Learnings
                            </h4>
                            <ul className="space-y-1">
                                {summary.keyLearnings.map((learning, i) => (
                                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                        <span className="text-primary mt-1">•</span>
                                        <span>{learning}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {weakAreas.length > 0 && (
                            <div>
                                <h4 className="font-semibold mb-2 flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                                    Areas to Focus On
                                </h4>
                                <div className="space-y-2">
                                    {weakAreas.map((area, i) => (
                                        <div
                                            key={i}
                                            className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3"
                                        >
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-medium text-sm">{area.area}</span>
                                                <Badge variant="secondary" className="text-xs">
                                                    {area.count} mentions
                                                </Badge>
                                            </div>
                                            <p className="text-xs text-muted-foreground">{area.details}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div>
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                                <span>🎯</span> Suggestions for Next Day
                            </h4>
                            <div className="space-y-2">
                                {summary.suggestions.map((suggestion, i) => (
                                    <div
                                        key={i}
                                        className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-sm"
                                    >
                                        {suggestion}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="text-xs text-muted-foreground pt-2 border-t">
                            Generated {formatDistanceToNow(new Date(summary.createdAt), { addSuffix: true })}
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    )
}
