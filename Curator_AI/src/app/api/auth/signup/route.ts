import { db } from "@/server/db"
import { hash } from "bcryptjs"
import { NextResponse } from "next/server"
import { z } from "zod"

const signupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(2),
})

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { email, password, name } = signupSchema.parse(body)

        const existingUser = await db.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return NextResponse.json(
                { message: "User already exists" },
                { status: 400 }
            )
        }

        const hashedPassword = await hash(password, 10)

        const user = await db.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        })

        return NextResponse.json(
            { message: "User created successfully", user: { id: user.id, email: user.email, name: user.name } },
            { status: 201 }
        )
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: error.issues }, { status: 400 })
        }
        console.error("Signup error:", error)
        return NextResponse.json(
            { message: "Something went wrong", error: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        )
    }
}
