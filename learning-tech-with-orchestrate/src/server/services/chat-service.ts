import { openai } from "@/server/ai/openai-client"
import { LEARNING_ASSISTANT_SYSTEM_PROMPT } from "@/server/ai/prompts/learning-assistant"
import { TechTopic, Profile } from "@prisma/client"

interface ChatMessage {
    role: "user" | "assistant" | "system"
    content: string
}

export const getTopicChatResponse = async (
    topic: TechTopic,
    profile: Profile | null,
    messages: ChatMessage[]
) => {
    const userLevel = profile?.experienceLevel || "BEGINNER"

    const systemPrompt = LEARNING_ASSISTANT_SYSTEM_PROMPT
        .replace("{{topicName}}", topic.name)
        .replace("{{topicDescription}}", topic.description || "")
        .replace("{{userLevel}}", userLevel)

    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini", // or gpt-3.5-turbo
        messages: [
            { role: "system", content: systemPrompt },
            ...messages,
        ],
        temperature: 0.7,
    })

    return response.choices[0].message.content
}
