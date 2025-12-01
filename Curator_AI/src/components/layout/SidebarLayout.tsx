"use client"

import { useState } from "react"
import { Sidebar } from "@/components/layout/Sidebar"
import { Button } from "@/components/ui/button"
import { PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarLayoutProps {
    children: React.ReactNode
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
    const [isOpen, setIsOpen] = useState(true)

    return (
        <div className={cn(
            "flex-1 container grid gap-12 py-6 transition-all duration-300 ease-in-out",
            isOpen ? "md:grid-cols-[200px_1fr]" : "md:grid-cols-[50px_1fr]"
        )}>
            <aside className={cn(
                "hidden flex-col md:flex transition-all duration-300 ease-in-out overflow-hidden",
                isOpen ? "w-[200px]" : "w-[50px]"
            )}>
                <div className={cn("flex mb-2", isOpen ? "justify-end" : "justify-center")}>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsOpen(!isOpen)}
                        title={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
                    >
                        {isOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
                    </Button>
                </div>
                <Sidebar collapsed={!isOpen} className="flex-1" />
            </aside>
            <main className="flex w-full flex-1 flex-col overflow-hidden">
                {children}
            </main>
        </div>
    )
}
