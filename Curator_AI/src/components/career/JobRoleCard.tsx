import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle } from "lucide-react"

interface JobRoleCardProps {
    recommendation: {
        role: string
        readiness: number
        missingSkills: string[]
        suggestedSteps: string[]
    }
}

export function JobRoleCard({ recommendation }: JobRoleCardProps) {
    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>{recommendation.role}</CardTitle>
                        <CardDescription>Job Readiness Score</CardDescription>
                    </div>
                    <div className="text-2xl font-bold">{recommendation.readiness}%</div>
                </div>
                <Progress value={recommendation.readiness} className="h-2" />
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <h4 className="text-sm font-semibold mb-2">Missing Skills</h4>
                    <div className="flex flex-wrap gap-2">
                        {recommendation.missingSkills.map((skill, i) => (
                            <Badge key={i} variant="secondary" className="gap-1">
                                <XCircle className="h-3 w-3 text-destructive" />
                                {skill}
                            </Badge>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 className="text-sm font-semibold mb-2">Suggested Next Steps</h4>
                    <ul className="space-y-2 text-sm">
                        {recommendation.suggestedSteps.map((step, i) => (
                            <li key={i} className="flex gap-2 items-start">
                                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                <span>{step}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </CardContent>
        </Card>
    )
}
