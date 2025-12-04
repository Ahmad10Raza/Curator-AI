import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Mail, Github, Globe } from "lucide-react"

interface PublicPortfolioHeaderProps {
    profile: {
        username: string
        bio: string | null
        tagline: string | null
        showEmail: boolean
    }
    user: {
        name: string | null
        image: string | null
        email: string | null
    }
}

export function PublicPortfolioHeader({ profile, user }: PublicPortfolioHeaderProps) {
    return (
        <div className="bg-card border rounded-lg p-8 mb-8 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-6">
                <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                    <AvatarImage src={user.image || ""} alt={user.name || ""} />
                    <AvatarFallback className="text-2xl">
                        {user.name?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
                    {profile.tagline && (
                        <p className="text-xl text-muted-foreground font-medium">
                            {profile.tagline}
                        </p>
                    )}
                    {profile.bio && (
                        <p className="text-muted-foreground max-w-2xl">
                            {profile.bio}
                        </p>
                    )}

                    <div className="flex flex-wrap gap-3 justify-center md:justify-start mt-4">
                        {profile.showEmail && user.email && (
                            <Button variant="outline" size="sm" className="gap-2" asChild>
                                <a href={`mailto:${user.email}`}>
                                    <Mail className="h-4 w-4" />
                                    Contact
                                </a>
                            </Button>
                        )}
                        {/* Future: Add social links from profile */}
                    </div>
                </div>
            </div>
        </div>
    )
}
