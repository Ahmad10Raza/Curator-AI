"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

export function MainNav({
    className,
    ...props
}: React.HTMLAttributes<HTMLElement>) {
    const pathname = usePathname()

    const routes = [
        {
            href: "/dashboard",
            label: "Dashboard",
            active: pathname === "/dashboard",
        },
        {
            href: "/topics",
            label: "Topics",
            active: pathname?.startsWith("/topics"),
        },
        {
            href: "/notes",
            label: "Notes",
            active: pathname?.startsWith("/notes"),
        },
        {
            href: "/timeline",
            label: "Timeline",
            active: pathname?.startsWith("/timeline"),
        },
        {
            href: "/paths",
            label: "Paths",
            active: pathname?.startsWith("/paths"),
        },
        {
            href: "/skills",
            label: "Skills",
            active: pathname?.startsWith("/skills"),
        },
        {
            href: "/quiz",
            label: "Quiz",
            active: pathname?.startsWith("/quiz"),
        },
        {
            href: "/projects",
            label: "Projects",
            active: pathname?.startsWith("/projects"),
        },
        {
            href: "/career",
            label: "Career",
            active: pathname?.startsWith("/career"),
        },
    ]

    return (
        <nav
            className={cn("flex items-center space-x-4 lg:space-x-6", className)}
            {...props}
        >
            {routes.map((route) => (
                <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                        "text-sm font-medium transition-colors hover:text-primary relative group",
                        route.active
                            ? "text-black dark:text-white"
                            : "text-muted-foreground"
                    )}
                >
                    {route.label}
                    <span className={cn(
                        "absolute -bottom-1 left-0 w-full h-0.5 bg-primary scale-x-0 transition-transform duration-300 group-hover:scale-x-100",
                        route.active && "scale-x-100"
                    )} />
                </Link>
            ))}
        </nav>
    )
}
