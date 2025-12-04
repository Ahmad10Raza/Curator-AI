import { Metadata } from "next"
import { Shell } from "@/components/layout/Shell"
import { getServerSession } from "next-auth"
import { authOptions } from "@/server/auth/auth-options"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Briefcase, ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
    title: "Career Center",
    description: "Manage your resume and find your dream job.",
}

export default async function CareerPage() {
    const session = await getServerSession(authOptions)
    if (!session?.user) redirect("/login")

    return (
        <Shell>
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Career Center</h1>
                    <p className="text-muted-foreground">
                        Tools to help you land your next role.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-10">
                            <FileText className="h-24 w-24" />
                        </div>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-primary" />
                                Resume Builder
                            </CardTitle>
                            <CardDescription>
                                Create, edit, and optimize your resume with AI.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-4 text-sm text-muted-foreground">
                                Upload your existing resume or generate a new one based on your learning progress.
                                Use our Markdown editor to fine-tune every detail.
                            </p>
                            <Button asChild>
                                <Link href="https://markdownresume.app/editor/" target="_blank" rel="noopener noreferrer">
                                    Open Builder <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-10">
                            <Briefcase className="h-24 w-24" />
                        </div>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Briefcase className="h-5 w-5 text-primary" />
                                Job Recommendations
                            </CardTitle>
                            <CardDescription>
                                Find roles that match your skills and experience.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-4 text-sm text-muted-foreground">
                                Get AI-powered job suggestions, analyze skill gaps for target roles,
                                and see your readiness score.
                            </p>
                            <Button asChild variant="secondary">
                                <Link href="/career/jobs">
                                    Find Jobs <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="space-y-1">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-yellow-500" />
                                Pro Tip
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Keep your profile updated with your latest projects and skills to get better job recommendations.
                            </p>
                        </div>
                        <Button variant="outline" asChild>
                            <Link href="/settings">
                                Update Profile
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </Shell>
    )
}
