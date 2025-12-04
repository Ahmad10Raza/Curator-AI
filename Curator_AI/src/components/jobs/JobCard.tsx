"use client"

import { JobRecommendation } from "@prisma/client"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, ExternalLink } from "lucide-react"

interface JobCardProps {
    job: JobRecommendation
}

export function JobCard({ job }: JobCardProps) {
    return (
        <Card className="flex flex-col h-full hover:shadow-md transition-shadow border-l-4 border-l-primary">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-lg font-semibold">{job.role}</CardTitle>
                        <p className="text-sm text-muted-foreground font-medium">{job.company || 'N/A'}</p>
                    </div>
                    <Badge variant={job.readiness >= 80 ? "default" : "secondary"}>
                        {job.readiness}% Ready
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
                <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.location || 'Remote'}
                    </div>
                </div>

                <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase text-muted-foreground">Missing Skills</p>
                    <div className="flex flex-wrap gap-2">
                        {job.missingSkills.map((skill, i) => (
                            <Badge key={i} variant="outline" className="text-xs font-normal">
                                {skill}
                            </Badge>
                        ))}
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button className="w-full" variant="outline" asChild disabled={!job.applyLink}>
                    <a href={job.applyLink || '#'} target="_blank" rel="noopener noreferrer">
                        Apply Now <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                </Button>
            </CardFooter>
        </Card>
    )
}
