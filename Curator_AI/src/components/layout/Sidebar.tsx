"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut, signIn } from "next-auth/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BarChart3, BookOpen, Home, LayoutDashboard, Settings, StickyNote, LogOut, LogIn, Layers, FileText } from "lucide-react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    collapsed?: boolean
}

export function Sidebar({ className, collapsed }: SidebarProps) {
    const pathname = usePathname()
    const { data: session } = useSession()

    const mainItems = [
        {
            title: "Dashboard",
            href: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            title: "Topics",
            href: "/topics",
            icon: BookOpen,
        },
        {
            title: "My Stack",
            href: "/enrolled-topics",
            icon: Layers,
        },
        {
            title: "My Notes",
            href: "/notes",
            icon: StickyNote,
        },
        {
            title: "Summaries",
            href: "/summaries",
            icon: BarChart3,
        },
        {
            title: "Resume",
            href: "/career/resume",
            icon: FileText,
        },
    ]

    const bottomItems = [
        {
            title: "Settings",
            href: "/settings",
            icon: Settings,
        },
    ]

    return (
        <div className={cn("flex flex-col h-full pb-12", className)}>
            <div className="space-y-4 py-4 flex-1">
                <div className="px-3 py-2">
                    <div className="space-y-1">
                        {mainItems.map((item) => (
                            <Button
                                key={item.href}
                                variant={pathname === item.href ? "secondary" : "ghost"}
                                className={cn(
                                    "w-full justify-start",
                                    collapsed && "justify-center px-2"
                                )}
                                asChild
                            >
                                <Link href={item.href}>
                                    <item.icon className={cn("h-4 w-4", !collapsed && "mr-2")} />
                                    {!collapsed && item.title}
                                </Link>
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="px-3 py-2 mt-auto">
                <div className="space-y-1">
                    {bottomItems.map((item) => (
                        <Button
                            key={item.href}
                            variant={pathname === item.href ? "secondary" : "ghost"}
                            className={cn(
                                "w-full justify-start",
                                collapsed && "justify-center px-2"
                            )}
                            asChild
                        >
                            <Link href={item.href}>
                                <item.icon className={cn("h-4 w-4", !collapsed && "mr-2")} />
                                {!collapsed && item.title}
                            </Link>
                        </Button>
                    ))}

                    {session ? (
                        <Button
                            variant="ghost"
                            className={cn(
                                "w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50",
                                collapsed && "justify-center px-2"
                            )}
                            onClick={() => signOut({ callbackUrl: "/" })}
                        >
                            <LogOut className={cn("h-4 w-4", !collapsed && "mr-2")} />
                            {!collapsed && "Log Out"}
                        </Button>
                    ) : (
                        <Button
                            variant="ghost"
                            className={cn(
                                "w-full justify-start",
                                collapsed && "justify-center px-2"
                            )}
                            onClick={() => signIn()}
                        >
                            <LogIn className={cn("h-4 w-4", !collapsed && "mr-2")} />
                            {!collapsed && "Log In"}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
