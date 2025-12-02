"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { useTheme } from "next-themes"

interface ProgressChartProps {
    data: {
        completed: number
        inProgress: number
        notStarted: number
    }
}

export function ProgressChart({ data }: ProgressChartProps) {
    const { theme } = useTheme()

    // Build chart data with theme-aware colors
    const chartData = [
        { name: "Completed", value: data.completed, color: "#10b981" }, // emerald-500
        { name: "In Progress", value: data.inProgress, color: "#3b82f6" }, // blue-500
        { name: "Not Started", value: data.notStarted, color: theme === 'dark' ? "#334155" : "#e5e7eb" }, // slate-700 (dark) / gray-200 (light)
    ].filter(item => item.value > 0)

    if (chartData.length === 0) {
        return (
            <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                No data available
            </div>
        )
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                >
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                    ))}
                </Pie>
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: '8px'
                    }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
        </ResponsiveContainer>
    )
}
