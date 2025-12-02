"use client"

import { useTheme } from "next-themes"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface StreakHeatmapProps {
    data: {
        date: string
        count: number
    }[]
}

export function StreakHeatmap({ data }: StreakHeatmapProps) {
    const { theme } = useTheme()

    // Helper to get color intensity based on count
    const getColor = (count: number) => {
        if (count === 0) return "bg-muted/40"
        if (count <= 2) return "bg-emerald-200 dark:bg-emerald-900/50"
        if (count <= 5) return "bg-emerald-400 dark:bg-emerald-700"
        if (count <= 8) return "bg-emerald-500 dark:bg-emerald-600"
        return "bg-emerald-600 dark:bg-emerald-500"
    }

    // Group data by weeks for the grid layout
    // This is a simplified approach; for a perfect calendar grid, we'd need more complex date math.
    // For now, we'll just render the blocks in a flex-wrap container which is responsive and looks good.

    return (
        <div className="w-full overflow-x-auto pb-2">
            <div className="min-w-[800px]">
                <div className="flex flex-wrap gap-1">
                    {data.map((day) => (
                        <TooltipProvider key={day.date}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div
                                        className={cn(
                                            "h-3 w-3 rounded-sm transition-colors hover:ring-1 hover:ring-ring",
                                            getColor(day.count)
                                        )}
                                    />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <div className="text-xs">
                                        <span className="font-semibold">{day.count} notes</span> on {new Date(day.date).toLocaleDateString()}
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    ))}
                </div>
                <div className="mt-4 flex items-center justify-end gap-2 text-xs text-muted-foreground">
                    <span>Less</span>
                    <div className="flex gap-1">
                        <div className="h-3 w-3 rounded-sm bg-muted/40" />
                        <div className="h-3 w-3 rounded-sm bg-emerald-200 dark:bg-emerald-900/50" />
                        <div className="h-3 w-3 rounded-sm bg-emerald-400 dark:bg-emerald-700" />
                        <div className="h-3 w-3 rounded-sm bg-emerald-500 dark:bg-emerald-600" />
                        <div className="h-3 w-3 rounded-sm bg-emerald-600 dark:bg-emerald-500" />
                    </div>
                    <span>More</span>
                </div>
            </div>
        </div>
    )
}
