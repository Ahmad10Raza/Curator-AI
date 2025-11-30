import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/server/auth/auth-options"
import { Button } from "@/components/ui/button"
import { UserAccountNav } from "@/components/layout/UserAccountNav"
import { MainNav } from "@/components/layout/MainNav"
import { ModeToggle } from "@/components/mode-toggle"

export async function Navbar() {
    const session = await getServerSession(authOptions)

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
                <div className="mr-4 hidden md:flex">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <span className="hidden font-bold sm:inline-block">
                            Curator-AI
                        </span>
                    </Link>
                    <MainNav />
                </div>
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <div className="w-full flex-1 md:w-auto md:flex-none">
                        {/* Search or other items */}
                    </div>
                    <nav className="flex items-center space-x-2">
                        <ModeToggle />
                        {session?.user ? (
                            <UserAccountNav user={session.user} />
                        ) : (
                            <Link href="/login">
                                <Button variant="ghost" size="sm">
                                    Sign In
                                </Button>
                            </Link>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    )
}
