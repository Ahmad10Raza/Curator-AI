import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/server/auth/auth-options"
import { getResumeProfile, updateResumeProfile } from "@/server/services/resume-service"

export async function GET(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const profile = await getResumeProfile(session.user.id)
        return NextResponse.json(profile || {})
    } catch (error) {
        console.error("Error fetching resume profile:", error)
        return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const body = await req.json()
        const updatedProfile = await updateResumeProfile(session.user.id, body)
        return NextResponse.json(updatedProfile)
    } catch (error) {
        console.error("Error updating resume profile:", error)
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
    }
}
