import { cookies } from 'next/headers'
import * as jose from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET)

export async function GET(request: Request) {
    const token = cookies().get('auth-token')?.value

    if (!token) {
        return new Response(JSON.stringify({ error: "Not authenticated" }), {
            status: 401,
        })
    }

    try {
        const { payload } = await jose.jwtVerify(token, JWT_SECRET)

        return Response.json({
            walletAddress: payload.walletAddress,
            email: payload.email,
            walletNetwork: payload.walletNetwork,
            verifiedPolicy: payload.verifiedPolicy,
        })
    } catch (error) {
        return Response.json({ error: 'Invalid token' }, { status: 401 })
    }
}
