import { withAuth } from "next-auth/middleware"

export default withAuth({
    callbacks: {
        authorized({ req, token }) {
            // `/dashboard`, `/topics`, `/notes`, `/settings` are protected
            // If token exists, user is authorized
            return !!token
        },
    },
})

export const config = {
    matcher: ["/dashboard/:path*", "/topics/:path*", "/notes/:path*", "/settings/:path*"],
}
