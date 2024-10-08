"use server"
import { cookies } from "next/headers";
import { redirect } from 'next/navigation'
import prisma from "../lib/prisma";
import * as jose from 'jose';
import DeleteUserButton from '@/components/deleteUserButton';

async function deleteUser(userId: string) {
    try {
        const response = await fetch("/api/users", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: userId }),
        });
        if (!response.ok) throw new Error("Failed to delete user");
        return true
    } catch (error) {
        console.error(error);
        return false
    }
}

export default async function UserPage() {
    const cookieStore = cookies()
    const token = cookieStore.get('auth-token')
    if (!token) {
        redirect('/')
    }
    const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET)
    let payload;
    try {
        ({ payload } = await jose.jwtVerify(token.value, JWT_SECRET))
    } catch (error) {
        redirect('/')
    }

    const user = await prisma.user.findFirst(
        {
            where: {
                id: payload.id
            },
            include: {
                ssoData: true,
                assets: true
            }
        }
    );
    
    if (!user) {
        return <div>User not found</div>
    }
    return (
    <div className="container mx-auto p-4">
        <li key={user.id} className="border-b border-gray-200 py-2">
            {user.email && <p><strong>Email:</strong> {user.email}</p>}
            {user.walletAddress && (
                <>
                    <p><strong>Wallet Address:</strong> {user.walletAddress}</p>
                    <p><strong>Wallet Network:</strong> {user.walletNetwork}</p>
                    <p><strong>Created At:</strong> {new Date(user.createdAt).toLocaleString()}</p>
                    <p><strong>Updated At:</strong> {new Date(user.updatedAt).toLocaleString()}</p>
                </>
            )}
            <p><strong>Role:</strong> {user.verifiedPolicy || 'Not verified'}</p>
            <DeleteUserButton user={{...user, verifiedPolicy: user.verifiedPolicy || '', walletAddress: user.walletAddress || ''}} />
        </li>
    </div>
    )
}