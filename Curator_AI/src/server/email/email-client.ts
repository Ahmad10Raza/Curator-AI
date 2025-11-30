import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY || "re_123")

export const sendDailySummaryEmail = async (email: string, summaryHtml: string) => {
    if (!process.env.RESEND_API_KEY) {
        console.log("Mocking email send to", email)
        console.log(summaryHtml)
        return
    }

    try {
        await resend.emails.send({
            from: "Curator-AI <onboarding@resend.dev>",
            to: email,
            subject: "Your Daily Learning Summary",
            html: summaryHtml,
        })
    } catch (error) {
        console.error("Failed to send email", error)
    }
}
