import { Resend } from "resend"
import { DailySummary } from "@prisma/client"

const resend = new Resend(process.env.RESEND_API_KEY)

interface WeakArea {
    area: string
    count: number
    details: string
}

export async function sendDailySummaryEmail(
    userEmail: string,
    userName: string,
    summary: DailySummary
) {
    try {
        const weakAreas = summary.weakAreas as unknown as WeakArea[]

        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 10px 10px 0 0;
            text-align: center;
        }
        .content {
            background: #f9fafb;
            padding: 30px;
            border-radius: 0 0 10px 10px;
        }
        .section {
            background: white;
            padding: 20px;
            margin-bottom: 20px;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .section h2 {
            color: #667eea;
            margin-top: 0;
            font-size: 18px;
        }
        ul {
            padding-left: 20px;
        }
        li {
            margin-bottom: 8px;
        }
        .weak-area {
            background: #fef3c7;
            padding: 12px;
            border-left: 4px solid #f59e0b;
            margin-bottom: 10px;
            border-radius: 4px;
        }
        .suggestion {
            background: #dbeafe;
            padding: 12px;
            border-left: 4px solid #3b82f6;
            margin-bottom: 10px;
            border-radius: 4px;
        }
        .stats {
            display: flex;
            justify-content: space-around;
            margin: 20px 0;
        }
        .stat {
            text-align: center;
        }
        .stat-number {
            font-size: 32px;
            font-weight: bold;
            color: #667eea;
        }
        .stat-label {
            font-size: 14px;
            color: #6b7280;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            color: #6b7280;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>📚 Your Daily Learning Summary</h1>
        <p>${new Date(summary.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
    </div>
    
    <div class="content">
        <div class="stats">
            <div class="stat">
                <div class="stat-number">${summary.notesAnalyzed}</div>
                <div class="stat-label">Notes</div>
            </div>
            <div class="stat">
                <div class="stat-number">${summary.topicsCompleted}</div>
                <div class="stat-label">Topics Completed</div>
            </div>
        </div>

        <div class="section">
            <h2>📝 Summary</h2>
            <p>${summary.summary}</p>
        </div>

        <div class="section">
            <h2>✨ Key Learnings</h2>
            <ul>
                ${summary.keyLearnings.map(learning => `<li>${learning}</li>`).join('')}
            </ul>
        </div>

        ${weakAreas.length > 0 ? `
        <div class="section">
            <h2>⚠️ Areas to Focus On</h2>
            ${weakAreas.map(area => `
                <div class="weak-area">
                    <strong>${area.area}</strong><br>
                    ${area.details}
                </div>
            `).join('')}
        </div>
        ` : ''}

        <div class="section">
            <h2>🎯 Suggestions for Tomorrow</h2>
            ${summary.suggestions.map(suggestion => `
                <div class="suggestion">
                    ${suggestion}
                </div>
            `).join('')}
        </div>
    </div>

    <div class="footer">
        <p>Keep up the great work, ${userName}! 🚀</p>
        <p><a href="${process.env.NEXTAUTH_URL}/timeline">View all summaries</a></p>
    </div>
</body>
</html>
        `

        const { data, error } = await resend.emails.send({
            from: process.env.FROM_EMAIL || "Curator AI <noreply@curatorai.com>",
            to: [userEmail],
            subject: `📚 Your Daily Learning Summary - ${new Date(summary.date).toLocaleDateString()}`,
            html: htmlContent,
        })

        if (error) {
            console.error("Error sending email:", error)
            throw error
        }

        console.log("Email sent successfully:", data)
        return data
    } catch (error) {
        console.error("Failed to send daily summary email:", error)
        throw error
    }
}
