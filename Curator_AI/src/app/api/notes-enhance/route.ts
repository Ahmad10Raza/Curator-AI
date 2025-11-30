import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/server/auth/auth-options"
import { openai } from "@/server/ai/openai-client"
import { NOTE_ENHANCER_SYSTEM_PROMPT } from "@/server/ai/prompts/note-enhancer"
import { z } from "zod"

const enhanceSchema = z.object({
    content: z.string().min(1),
    mode: z.enum(["summarize", "structure"]),
})

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const body = await req.json()
        const { content, mode } = enhanceSchema.parse(body)

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: NOTE_ENHANCER_SYSTEM_PROMPT },
                { role: "user", content: `Mode: ${mode}\n\nContent:\n${content}` },
            ],
            temperature: 0.5,
        })

        const enhancedContent = response.choices[0].message.content

        return NextResponse.json({ content: enhancedContent })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 })
        }
        console.error(error)
        return NextResponse.json({ error: "Failed to enhance note" }, { status: 500 })
    }
}
