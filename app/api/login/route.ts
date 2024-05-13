import prisma from "@/app/lib/prisma";
import { loginUser } from "littlefish-nft-auth-framework-beta/backend";
//const { signupUser } = require('littlefish-nft-auth-framework-beta');

export async function POST(request: Request) {
    const body = await request.json();
    let user;
    const {
        email,
        password,
        walletAddress,
        walletNetwork,
        signature,
        key,
        nonce
    } = body;
    if (email && password) {
        user = await prisma.user.findFirst({
            where: {
                email,
            },
        });
    } else if (walletAddress && walletNetwork) {
        user = await prisma.user.findFirst({
            where: {
                walletAddress,
            },
        });
    }
    
    const options = { email, password, walletAddress, walletNetwork, signature, key, nonce };
    //const result = await loginUser(user, body);
    console.log(result)
    //const result = { success: true, email, passwordHash, walletAddress, walletNetwork, signature, key, nonce };
    if (!result.success) {
        return new Response(JSON.stringify({ error: result.error }), { status: 400 });
    }

    if (result.success) {
        if (result.email && result.passwordHash) {
            await prisma.user.create({
                data: {
                    email: result.email,
                    password: result.passwordHash,
                    emailVerified: new Date(),
                },
            });
        } else {
            await prisma.user.create({
                data: {
                    walletAddress: result.walletAddress,
                    walletNetwork: result.walletNetwork,
                    walletAddressVerified: new Date(),
                },
            });
        }
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
}