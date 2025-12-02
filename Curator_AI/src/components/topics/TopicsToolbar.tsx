"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import { useState, useEffect } from "react"
import { useDebounce } from "@/hooks/use-debounce"

interface TopicsToolbarProps {
    categories: string[]
    difficulties: string[]
}

export function TopicsToolbar({ categories, difficulties }: TopicsToolbarProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [search, setSearch] = useState(searchParams.get("search") || "")
    const [difficulty, setDifficulty] = useState(searchParams.get("difficulty") || "ALL")
    const [category, setCategory] = useState(searchParams.get("category") || "ALL")

    const debouncedSearch = useDebounce(search, 500)

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString())

        if (debouncedSearch) {
            params.set("search", debouncedSearch)
        } else {
            params.delete("search")
        }

        if (difficulty && difficulty !== "ALL") {
            params.set("difficulty", difficulty)
        } else {
            params.delete("difficulty")
        }

        if (category && category !== "ALL") {
            params.set("category", category)
        } else {
            params.delete("category")
        }

        router.push(`/topics?${params.toString()}`)
    }, [debouncedSearch, difficulty, category, router, searchParams])

    const clearFilters = () => {
        setSearch("")
        setDifficulty("ALL")
        setCategory("ALL")
        router.push("/topics")
    }

    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <div className="relative w-full md:w-[300px]">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search topics..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-8"
                    />
                </div>
                {(search || difficulty !== "ALL" || category !== "ALL") && (
                    <Button variant="ghost" onClick={clearFilters} size="sm" className="h-8 px-2 lg:px-3">
                        Reset
                        <X className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Difficulties</SelectItem>
                        {difficulties.map((diff) => (
                            <SelectItem key={diff} value={diff}>
                                {diff}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Categories</SelectItem>
                        {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                                {cat}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button variant="outline" onClick={() => router.push("/enrolled-topics")}>
                    My Stack
                </Button>
            </div>
        </div>
    )
}
