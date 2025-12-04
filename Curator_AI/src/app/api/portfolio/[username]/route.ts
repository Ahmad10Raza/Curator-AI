import { NextResponse } from "next/server"
import { getPortfolioByUsername } from "@/server/services/public-profile-service"

export async function GET(
    req: Request,
    props: { params: Promise<{ username: string }> }
) {
    const params = await props.params;
    try {
        const data = await getPortfolioByUsername(params.username)

        if (!data) {
            return new NextResponse("Portfolio not found", { status: 404 })
        }

        return NextResponse.json(data)

    } catch (error) {
        console.error("[PORTFOLIO_GET]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
