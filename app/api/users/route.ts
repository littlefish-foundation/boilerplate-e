import prisma from "@/app/lib/prisma";
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import * as jose from 'jose';
function getCookies() {
    try {
        return cookies();
    } catch (error) {
        console.error('Failed to access cookies:', error);
        return null;
    }
}

function isAuthenticated() {
    const cookiesObj = getCookies();
    return cookiesObj && cookiesObj.get('auth-token');
}

export async function GET(request: Request) {
    if (!isAuthenticated()) {
        return new Response(JSON.stringify({ error: "Authentication failed" }), {
            status: 401,
        });
    }

    const users = await prisma.user.findMany();
    if (!users) {
        return new Response(JSON.stringify({ error: "No users found" }), {
            status: 404,
        });
    }
    return new Response(JSON.stringify(users), {
        status: 200,
    });
}

export async function POST(request: Request) {
    if (!isAuthenticated()) {
        return new Response(JSON.stringify({ error: "Authentication failed" }), {
            status: 401,
        });
    }

    const { id } = await request.json();
    const user = await prisma.user.findUnique({
        where: { id: id },
    });

    if (!user) {
        return new Response(JSON.stringify({ error: "User not found" }), {
            status: 404,
        });
    }

    // Update the user verifiedPolicy
    const verifiedPolicy = "admin";
    if (user.roles.includes(verifiedPolicy)) {
        try {
            const updatedUser = await prisma.user.update({
                where: { id: user.id },
                data: { roles: [] },
            });
            return new Response(JSON.stringify(updatedUser), {
                status: 200,
            });
        } catch (error) {
            return new Response(JSON.stringify({ error: "Failed to update user" }), {
                status: 500,
            });
        }
    } else {
        try {
            const updatedUser = await prisma.user.update({
                where: { id: user.id },
                data: { roles: ["admin"] },
            });
            return new Response(JSON.stringify(updatedUser), {
                status: 200,
            });
        } catch (error) {
            return new Response(JSON.stringify({ error: "Failed to update user" }), {
                status: 500,
            });
        }
    }
}

export async function DELETE(request: Request) {
    const cookieStore = cookies();
    const authToken = cookieStore.get('auth-token');

    if (!authToken) {
        return NextResponse.json({ error: "Authentication failed" }, { status: 401 });
    }

    const { id } = await request.json();

    if (!id) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    try {
        // Delete related records in a transaction
        await prisma.$transaction(async (prisma) => {
            // Delete SSO data
            await prisma.sso.deleteMany({
                where: { UserId: id },
            });

            // Delete the user's assets
            await prisma.asset.deleteMany({
                where: { UserId: id },
            });

            // Delete the user
            await prisma.user.delete({
                where: { id: id },
            });
        });

        // Check if the deleted user is the current user
        const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
        let payload;
        try {
            ({ payload } = await jose.jwtVerify(authToken.value, JWT_SECRET));
        } catch (error) {
            console.error("Error verifying token:", error);
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        let message = "User and related data deleted successfully";
        let shouldTerminateSession = false;

        if (payload.id === id) {
            message += ", session terminated";
            shouldTerminateSession = true;
        }

        const response = NextResponse.json({ 
            message: message,
            deletedUserId: id,
            shouldTerminateSession: shouldTerminateSession
        }, { status: 200 });

        if (shouldTerminateSession) {
            response.cookies.delete('auth-token');
        }

        return response;

    } catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json({ error: "Failed to delete user and related data" }, { status: 500 });
    }
}