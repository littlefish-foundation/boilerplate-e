import { cookies } from "next/headers"; // Import the cookies function from Next.js for handling cookies
import { NextResponse } from "next/server"; // Import NextResponse for creating responses
import type { NextRequest } from "next/server"; // Import the NextRequest type for typing the request object
import * as jose from "jose"; // Import the jose library for JWT handling

// Middleware function to handle authentication
export async function middleware(request: NextRequest) {
    // Get the "Authorization" cookie from the request
    const cookie = cookies().get("Authorization");
    
    // If the cookie is not present, redirect to the login page
    if (!cookie) {   
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Prepare the JWT secret for verification
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const jwt = cookie.value; // Get the JWT from the cookie value

    try {
        // Verify the JWT using the secret
        const { payload } = await jose.jwtVerify(jwt, secret, {});
        console.log(payload); // Log the payload for debugging purposes
    } catch (e) {
        // If verification fails, redirect to the login page
        return NextResponse.redirect(new URL("/login", request.url));
    }
}

// Configuration object to specify which paths the middleware should match
export const config = {
    matcher: "/assets/:path*", // Apply the middleware to all paths under /assets
};
