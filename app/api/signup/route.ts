import prisma from "@/app/lib/prisma";
import { signupUser } from "littlefish-nft-auth-framework-beta/backend";
//const { signupUser } = require('littlefish-nft-auth-framework-beta');

export async function POST(request: Request) {
    const body = await request.json();
    const {
        email,
        password,
        walletAddress,
        walletNetwork,
        signature,
        key,
        nonce
    } = body;
    console.log(body)
    const options = { email, password, walletAddress, walletNetwork, signature, key, nonce };
    const result = await signupUser(body);
    console.log(result)
    //const result = { success: true, email, passwordHash, walletAddress, walletNetwork, signature, key, nonce };
    if (!result.success) {
        return new Response(JSON.stringify({ error: result.error }), { status: 400 });
    }
    try {
    if (result.success) {
        if ( result.email && result.passwordHash ) {
            const existingUser = await prisma.user.findFirst({
                where: {
                    email: result.email,
                },
            });
            if (existingUser) {
                return new Response(JSON.stringify({ error: "existingUser" }), { status: 400 });
            }
            await prisma.user.create({
                data: {
                    email: result.email,
                    password: result.passwordHash,
                    emailVerified: new Date(),
                },
            });
        } else {
            const existingUser = await prisma.user.findFirst({
                where: {
                    walletAddress: result.walletAddress,
                },
            });
            if (existingUser) {
                return new Response(JSON.stringify({ error: "existingUser" }), { status: 400 });
            }
            await prisma.user.create({
                data: {
                    walletAddress: result.walletAddress,
                    walletNetwork: result.walletNetwork,
                    walletAddressVerified: new Date(),
                },
            });
        }
    }
    } catch (error) {
        console.log(error)
        return new Response(JSON.stringify({ error: error }), { status: 400 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
}