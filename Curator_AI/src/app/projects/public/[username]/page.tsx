import { Metadata } from "next"
import { getPortfolioByUsername } from "@/server/services/public-profile-service"
import { PublicPortfolioHeader } from "@/components/portfolio/PublicPortfolioHeader"
import { PublicProjectList } from "@/components/portfolio/PublicProjectList"
import { notFound } from "next/navigation"

interface PublicPortfolioPageProps {
    params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: PublicPortfolioPageProps): Promise<Metadata> {
    const { username } = await params
    const data = await getPortfolioByUsername(username)

    if (!data) return { title: "Portfolio Not Found" }

    return {
        title: `${data.user.name || username}'s Portfolio`,
        description: data.profile.tagline || `Check out ${data.user.name || username}'s projects.`,
    }
}

export default async function PublicPortfolioPage({ params }: PublicPortfolioPageProps) {
    const { username } = await params
    const data = await getPortfolioByUsername(username)

    if (!data) notFound()

    return (
        <div className="container mx-auto py-12 px-4">
            <PublicPortfolioHeader profile={data.profile} user={data.user} />

            <div className="space-y-6">
                <h2 className="text-2xl font-bold tracking-tight">Projects</h2>
                <PublicProjectList projects={data.projects} />
            </div>
        </div>
    )
}
