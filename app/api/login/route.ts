import { loginUser } from "littlefish-nft-auth-framework-beta/backend";
import * as jose from "jose"; // Import the jose library for JWT handling
import { PrismaClient, User } from "@prisma/client"; // Import PrismaClient and User type

// Initialize Prisma Client
const prismaClient = new PrismaClient();

// Define the POST function to handle login requests
export async function POST(request: Request) {
    try {
        // Parse the incoming JSON request body
        const body = await request.json();
        let user: User | null; // Declare a variable to store the user details

        // Destructure relevant fields from the request body
        const {
            email,
            password,
            walletAddress,
            walletNetwork,
            signature,
            key,
            nonce
        } = body;

        // Check if the login is using email and password
        if (email && password) {
            // Find the user by email in the database
            user = await prismaClient.user.findFirst({
                where: {
                    email,
                },
            });
        // Check if the login is using wallet address and network
        } else if (walletAddress && walletNetwork) {
            // Find the user by wallet address in the database
            user = await prismaClient.user.findFirst({
                where: {
                    walletAddress,
                    walletNetwork,
                },
            });
        } else {
            // If no login method is provided, return an error response
            return new Response(JSON.stringify({ error: "Invalid login method" }), { status: 400 });
        }

        // If no user is found, return an error response
        if (!user) {
            return new Response(JSON.stringify({ error: "User not found" }), { status: 400 });
        }

        // Sanitize the user object to ensure compatibility with loginUser function
        const sanitizedUser = {
            ...user,
            email: user.email ?? undefined,
            emailVerified: user.emailVerified ?? undefined,
            password: user.password ?? undefined,
            walletAddress: user.walletAddress ?? undefined,
            walletAddressVerified: user.walletAddressVerified ?? undefined,
            walletNetwork: user.walletNetwork ?? undefined,
            policyId: user.policyId ?? undefined,
            assetName: user.assetName ?? undefined,
            image: user.image ?? undefined,
        };

        // Call the loginUser function with the sanitized user details and request body
        const result = loginUser(sanitizedUser, body);

        // If the loginUser function returns an error, return an error response
        if (!result.success) {
            return new Response(JSON.stringify({ error: result.error }), { status: 400 });
        }

        // Prepare the JWT secret and algorithm
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const alg = "HS256";

        // Create and sign a new JWT
        const jwt = await new jose.SignJWT({})
            .setProtectedHeader({ alg }) // Set the algorithm in the protected header
            .setIssuedAt() // Set the issued at time
            .setIssuer("littlefish") // Set the issuer
            .setSubject(user.id) // Set the subject to the user ID
            .setExpirationTime("2h") // Set the expiration time to 2 hours
            .sign(secret); // Sign the JWT with the secret

        // Return a response with the signed JWT
        return new Response(JSON.stringify({ token: jwt }), { status: 200 });

    } catch (error) {
        // Handle any unexpected errors
        console.error("Error handling login request:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
}
