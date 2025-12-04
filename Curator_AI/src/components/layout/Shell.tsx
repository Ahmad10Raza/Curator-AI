



interface ShellProps {
    children: React.ReactNode
}

export function Shell({ children }: ShellProps) {
    return (
        <div className="flex min-h-screen flex-col">
            <div className="flex-1 container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {children}
            </div>
        </div>
    )
}
