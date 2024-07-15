// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import * as jose from 'jose'

interface Policy {
    id: string;
    policyID: string;
    createdAt: string;
    updatedAt: string;
}

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET)

// Cache policies to reduce API calls
let cachedPolicies: Policy[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function getPolicies(): Promise<Policy[]> {
    const currentTime = Date.now();
    if (cachedPolicies && currentTime - lastFetchTime < CACHE_DURATION) {
        return cachedPolicies;
    }

    try {
        const response = await fetch(`${process.env.ROOT_URL}/api/policy`);
        if (!response.ok) {
            throw new Error(`Failed to fetch policies: ${response.statusText}`);
        }
        const data: Policy[] = await response.json();
        cachedPolicies = data;
        lastFetchTime = currentTime;
        return data;
    } catch (error) {
        console.error('Error fetching policies:', error);
        return cachedPolicies || []; // Return cached policies if available, else empty array
    }
}

export async function middleware(request: NextRequest) {
    if (request.nextUrl.pathname === '/cookies-required') {
        return NextResponse.next()
    }

    const cookieCheckPerformed = request.cookies.has('cookie_check_performed')

    if (!cookieCheckPerformed) {
        return NextResponse.next()
    }

    if (!request.cookies.has('cookie_support_check')) {
        // Cookies are not supported or blocked, redirect to cookie-required page
        return NextResponse.redirect(new URL('/cookies-required', request.url))
    }

    const authPaths = ['/settings', '/dashboard', '/asset1', '/asset2']
    const adminPaths = ['/settings']
    const assetPaths = {
        '/asset1': 0,
        '/asset2': 1
    }

    // Check if the current path requires authentication
    if (authPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
        const token = request.cookies.get('auth-token')?.value

        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url))
        }

        try {
            const { payload } = await jose.jwtVerify(token, JWT_SECRET)
            const policies = await getPolicies();

            // Check permissions
            if (adminPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
                if (payload.verifiedPolicy !== 'admin') {
                    return NextResponse.redirect(new URL('/', request.url))
                }
            }

            const assetPath = Object.keys(assetPaths).find(path => request.nextUrl.pathname.startsWith(path));
            if (assetPath) {
                const requiredPolicy = policies[assetPaths[assetPath as keyof typeof assetPaths]]?.policyID;
                if (payload.verifiedPolicy !== requiredPolicy && payload.verifiedPolicy !== "admin") {
                    return NextResponse.redirect(new URL('/', request.url))
                }
            }

            // Add user info to headers
            const requestHeaders = new Headers(request.headers)
            requestHeaders.set('x-user-id', payload.sub as string)
            requestHeaders.set('x-user-email', payload.email as string)
            requestHeaders.set('x-user-role', payload.verifiedPolicy as string)

            return NextResponse.next({
                request: { headers: requestHeaders },
            })
        } catch (error) {
            console.error('Error verifying token:', error)
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/settings/:path*', '/dashboard/:path*', '/asset1/:path*', '/asset2/:path*', '/cookies-required', '/((?!api|_next/static|_next/image|favicon.ico).*)'],
}