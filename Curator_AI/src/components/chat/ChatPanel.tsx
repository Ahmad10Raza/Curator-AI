"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area" // Need to install scroll-area
import { Loader2, Send } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatMessage {
    role: "user" | "assistant"
    content: string
}

interface ChatPanelProps {
    topicId: string
}

export function ChatPanel({ topicId }: ChatPanelProps) {
    const [messages, setMessages] = React.useState<ChatMessage[]>([])
    const [input, setInput] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(false)
    const scrollRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!input.trim() || isLoading) return

        const userMessage: ChatMessage = { role: "user", content: input }
        setMessages((prev) => [...prev, userMessage])
        setInput("")
        setIsLoading(true)

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    topicId,
                    messages: [...messages, userMessage],
                }),
            })

            if (!response.ok) {
                throw new Error("Failed to get response")
            }

            const data = await response.json()
            setMessages((prev) => [...prev, data])
        } catch (error) {
            console.error(error)
            // Handle error (toast)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-col h-[600px] border rounded-md bg-background">
            <div className="flex-1 p-4 overflow-y-auto" ref={scrollRef}>
                {messages.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center space-y-4 text-muted-foreground">
                        <p>Ask me anything about this topic!</p>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            {["Explain like I'm 5", "Give a real project example", "Test me with a quiz", "Key concepts summary"].map((prompt) => (
                                <Button
                                    key={prompt}
                                    variant="outline"
                                    size="sm"
                                    className="h-auto whitespace-normal text-left"
                                    onClick={() => {
                                        setInput(prompt)
                                        // Optional: auto-submit
                                    }}
                                >
                                    {prompt}
                                </Button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "flex w-max max-w-[80%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                                    msg.role === "user"
                                        ? "ml-auto bg-primary text-primary-foreground"
                                        : "bg-muted"
                                )}
                            >
                                {msg.content}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex w-max max-w-[80%] flex-col gap-2 rounded-lg px-3 py-2 text-sm bg-muted">
                                <Loader2 className="h-4 w-4 animate-spin" />
                            </div>
                        )}
                    </div>
                )}
            </div>
            <div className="p-4 border-t bg-background">
                <form onSubmit={onSubmit} className="flex gap-2">
                    <Input
                        placeholder="Type your question..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={isLoading}
                    />
                    <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                        <Send className="h-4 w-4" />
                        <span className="sr-only">Send</span>
                    </Button>
                </form>
            </div>
        </div>
    )
}
