



interface ShellProps {
    children: React.ReactNode
}

export function Shell({ children }: ShellProps) {
    return (
        <div className="flex min-h-screen flex-col">
            <div className="flex-1 space-y-4">
                {children}
            </div>
        </div>
    )
}
