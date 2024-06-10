import { loginUser, setConfig } from "littlefish-nft-auth-framework/backend";
import * as jose from "jose"; // Import the jose library for JWT handling
import { PrismaClient, User } from "@prisma/client"; // Import PrismaClient and User type
import { Asset } from "littlefish-nft-auth-framework/frontend"; // Import the Asset type from the frontend

const config = {
  0: { // preprod
    apiKey: process.env.PREPROD_API_KEY,
    networkId: 'preprod',
  },
  1: { // mainnet
    apiKey: process.env.MAINNET_API_KEY,
    networkId: 'mainnet',
  },
  // Add other networks as needed
};

// Initialize Prisma Client
const prismaClient = new PrismaClient();

// Define an extended type to include the assets property
interface UserWithAssets extends User {
  assets: Asset[];
}

// Define the POST function to handle login requests
export async function POST(request: Request) {
  try {
    // Parse the incoming JSON request body
    const body = await request.json();
    let user: UserWithAssets | null; // Declare a variable to store the user details

    // Destructure relevant fields from the request body
    const {
      email,
      password,
      walletAddress,
      walletNetwork,
      signature,
      key,
      nonce,
      asset,
    } = body;

    const networkConfig = config[walletNetwork as keyof typeof config];
    if (!networkConfig || !networkConfig.apiKey) {
      throw new Error("Configuration for the provided network is missing or incomplete.");
    }
    setConfig(networkConfig.apiKey, networkConfig.networkId);

    // Check if the login is using email and password
    if (email && password) {
      // Find the user by email in the database
      user = await prismaClient.user.findFirst({
        where: {
          email,
        },
        include: {
          assets: true,
        },
      }) as UserWithAssets;
    } else if (walletAddress) {
      // Find the user by wallet address in the database
      user = await prismaClient.user.findFirst({
        where: {
          walletAddress,
          walletNetwork,
        },
        include: {
          assets: true,
        },
      }) as UserWithAssets;
    } else {
      // If no login method is provided, return an error response
      return new Response(JSON.stringify({ error: "Invalid login method" }), {
        status: 400,
      });
    }

    // If no user is found, return an error response
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 400,
      });
    }

    // Sanitize the user object to ensure compatibility with loginUser function
    let sanitizedUser;
    if (asset) {
      const matchingAsset = user.assets.some(
        (userAsset: Asset) =>
          asset.policyID === userAsset.policyID &&
          asset.assetName === userAsset.assetName
      );
      if (!matchingAsset) {
        return new Response(JSON.stringify({ error: "Asset not found" }), {
          status: 400,
        });
      }
      sanitizedUser = {
        ...user,
        email: user.email ?? undefined,
        password: user.password ?? undefined,
        stakeAddress: user.walletAddress ?? undefined, // Changed field name
        walletNetwork: user.walletNetwork ?? undefined,
        asset: asset,
      };
    } else {
      sanitizedUser = {
        ...user,
        email: user.email ?? undefined,
        password: user.password ?? undefined,
        stakeAddress: user.walletAddress ?? undefined, // Changed field name
        walletNetwork: user.walletNetwork ?? undefined,
      };
    }

    // Call the loginUser function with the sanitized user details and request body
    const result = await loginUser(sanitizedUser, {
      ...body,
      stakeAddress: walletAddress,
    });

    // If the loginUser function returns an error, return an error response
    if (!result.success) {
      return new Response(JSON.stringify({ error: result.error }), {
        status: 400,
      });
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
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
