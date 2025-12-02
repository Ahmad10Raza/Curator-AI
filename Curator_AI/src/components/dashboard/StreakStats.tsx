"use client"

import { useTheme } from "next-themes"

interface StreakStatsProps {
    stats: {
        totalActiveDays: number
        streak: number
        longestStreak: number
        firstActivityDate?: string
    }
}

export function StreakStats({ stats }: StreakStatsProps) {
    const { theme } = useTheme()

    // Calculate circular progress (max 30 days for visual purposes)
    const maxDays = 30
    const progress = Math.min((stats.streak / maxDays) * 100, 100)
    const circumference = 2 * Math.PI * 45
    const strokeDashoffset = circumference - (progress / 100) * circumference

    return (
        <div className="grid grid-cols-3 gap-8 p-6">
            {/* Total Contributions */}
            <div className="flex flex-col items-center justify-center space-y-2">
                <div className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                    {stats.totalActiveDays}
                </div>
                <div className="text-sm font-medium text-pink-500">Total Active Days</div>
                <div className="text-xs text-muted-foreground">
                    {stats.firstActivityDate ? `Since ${new Date(stats.firstActivityDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}` : 'All time'}
                </div>
            </div>

            {/* Current Streak - Circular */}
            <div className="flex flex-col items-center justify-center space-y-2">
                <div className="relative w-32 h-32">
                    <svg className="transform -rotate-90 w-32 h-32">
                        {/* Background circle */}
                        <circle
                            cx="64"
                            cy="64"
                            r="45"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            className="text-muted/20"
                        />
                        {/* Progress circle */}
                        <circle
                            cx="64"
                            cy="64"
                            r="45"
                            stroke="url(#gradient)"
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            className="transition-all duration-500"
                        />
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#ec4899" />
                                <stop offset="100%" stopColor="#8b5cf6" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                            {stats.streak}
                        </span>
                    </div>
                </div>
                <div className="text-sm font-medium text-yellow-500">Current Streak</div>
                <div className="text-xs text-muted-foreground">Keep it going!</div>
            </div>

            {/* Longest Streak */}
            <div className="flex flex-col items-center justify-center space-y-2">
                <div className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                    {stats.longestStreak}
                </div>
                <div className="text-sm font-medium text-pink-500">Longest Streak</div>
                <div className="text-xs text-muted-foreground">Personal best</div>
            </div>
        </div>
    )
}
