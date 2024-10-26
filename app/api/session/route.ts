import { cookies } from 'next/headers'
import * as jose from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET)

function getCookies() {
    try {
        return cookies();
    } catch (error) {
        console.error('Failed to access cookies:', error);
        return null;
    }
}

export async function GET(request: Request) {
    const cookiesObj = getCookies();
    if (!cookiesObj) {
        return Response.json({ error: "Cookie access blocked" }, { status: 403 });
    }
    
    const token = cookies().get('auth-token')?.value

    if (!token) {
        return new Response(JSON.stringify({ error: "Not authenticated" }), {
            status: 401,
        })
    }

    try {
        const { payload } = await jose.jwtVerify(token, JWT_SECRET)

        // Set the cookie_support_check cookie if it doesn't exist
        if (!cookies().get('cookie_support_check')) {
            cookies().set('cookie_support_check', '1', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 24 * 60 * 60, // 24 hours
                path: '/',
            });
        }

        return Response.json({
            walletAddress: payload.walletAddress,
            email: payload.email,
            walletNetwork: payload.walletNetwork,
            roles: payload.roles,
        })
    } catch (error) {
        return Response.json({ error: 'Invalid token' }, { status: 401 })
    }
}