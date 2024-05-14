import prisma from "@/app/lib/prisma";
import { loginUser } from "littlefish-nft-auth-framework-beta/backend";
import * as jose from "jose";
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
    if (user === null) {
        return new Response(JSON.stringify({ error: "User not found" }), { status: 400 });
    }
    //const options = { email, password, walletAddress, walletNetwork, signature, key, nonce };
    const result = loginUser(user, body);
    //const result = { success: true, email, passwordHash, walletAddress, walletNetwork, signature, key, nonce };
    if (!result.success) {
        return new Response(JSON.stringify({ error: result.error }), { status: 400 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const alg = "HS256";

    const jwt = await new jose.SignJWT({})
        .setProtectedHeader({ alg })
        .setIssuedAt()
        .setIssuer("littlefish")
        .setSubject(user.id)
        .setExpirationTime("2h")
        .sign(secret);

    return Response.json({ token: jwt });
}