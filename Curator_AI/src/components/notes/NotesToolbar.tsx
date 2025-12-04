"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, LayoutGrid, List as ListIcon } from "lucide-react"
import { useState, useEffect } from "react"
import { useDebounce } from "@/hooks/use-debounce"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export function NotesToolbar() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [search, setSearch] = useState(searchParams.get("search") || "")
    const [view, setView] = useState<"grid" | "list">((searchParams.get("view") as "grid" | "list") || "grid")

    const debouncedSearch = useDebounce(search, 500)

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString())
        const currentSearch = params.get("search") || ""
        const currentView = params.get("view") || "grid"

        // Only update if values have actually changed
        if (debouncedSearch === currentSearch && view === currentView) {
            return
        }

        if (debouncedSearch) {
            params.set("search", debouncedSearch)
        } else {
            params.delete("search")
        }

        if (view) {
            params.set("view", view)
        }

        router.push(`/notes?${params.toString()}`, { scroll: false })
    }, [debouncedSearch, view, router, searchParams])

    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:w-[300px]">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search notes..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-8"
                />
            </div>
            <ToggleGroup type="single" value={view} onValueChange={(v: string) => v && setView(v as "grid" | "list")}>
                <ToggleGroupItem value="grid" aria-label="Grid view">
                    <LayoutGrid className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="list" aria-label="List view">
                    <ListIcon className="h-4 w-4" />
                </ToggleGroupItem>
            </ToggleGroup>
        </div>
    )
}
