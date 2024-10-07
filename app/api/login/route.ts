import { loginUser, setConfig } from "littlefish-nft-auth-framework/backend";
import * as jose from "jose"; // Import the jose library for JWT handling
import { PrismaClient, User } from "@prisma/client"; // Import PrismaClient and User type
import { Asset } from "littlefish-nft-auth-framework/frontend"; // Import the Asset type from the frontend
import prisma from "@/app/lib/prisma";

const getConfig = () => ({
  0: {
    // preprod
    apiKey: process.env.PREPROD_API_KEY,
    networkId: "preprod",
  },
  1: {
    // mainnet
    apiKey: process.env.MAINNET_API_KEY,
    networkId: "mainnet",
  },
  // Add other networks as needed
});

// Initialize Prisma Client
const prismaClient = new PrismaClient();

// Define an extended type to include the assets property
interface UserWithAssets extends User {
  assets: Asset[];
}

// Define the POST function to handle login requests
export async function POST(request: Request) {
  // Parse the incoming JSON request body
  const body = await request.json();
  let user: UserWithAssets | null; // Declare a variable to store the user details
  let verifiedPolicy: String;

  // Destructure relevant fields from the request body
  const {
    email,
    password,
    walletAddress,
    walletNetwork,
    signature,
    key,
    nonce,
    policyID,
    assetName,
    amount,
  } = body;

  if (email && password) {
    // If email and password are provided, attempt to login with email and password
    verifiedPolicy = "null";
    user = await prisma.user.findFirst({
      where: { email },
      include: { assets: true },
    });
    if (user?.verifiedPolicy === "admin") {
      verifiedPolicy = "admin";
    }

    // If the user does not exist, return a 404 response
    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    if (user.assets.length !== 0) {
      return new Response("Asset details required for this user", { status: 400 })
    }

    const sanitizedUser = {
      email: user.email as string,
      password: user.password as string,
    };
    const isValid = await loginUser(sanitizedUser, { email, password });
    if (!isValid.success) {
      return new Response("Invalid credentials", { status: 401 });
    }
  }

  else if (walletAddress && signature && key && nonce) {
    const config = getConfig();
    const networkConfig = config[walletNetwork as keyof typeof config];
    if (!networkConfig || !networkConfig.apiKey) {
      return new Response("Configuration for the provided network is missing or incomplete.", { status: 400 });
    }
    setConfig(networkConfig.apiKey, networkConfig.networkId);
    // If wallet details are provided, attempt to login with wallet details
    verifiedPolicy = "null";
    user = await prisma.user.findFirst({
      where: { walletAddress },
      include: { assets: true },
    });
    // If the user does not exist, return a 404 response
    if (!user) {
      return new Response("User not found", { status: 404 });
    }
    if (policyID && assetName && amount) {
      const asset = { policyID, assetName, amount };
      const verifiedPolicies = await prisma.policy.findMany();
      if (user.verifiedPolicy !== "admin") {
        if (verifiedPolicies.some((policy) => policy.policyID === asset.policyID)) {
          verifiedPolicy = asset.policyID;
        }
      }
      if (user.verifiedPolicy === "admin") {
        verifiedPolicy = "admin";
      }

      const assetToSanitize = user.assets.find((matchingAsset) => matchingAsset.policyID === asset.policyID && matchingAsset.assetName === asset.assetName);
      if (!assetToSanitize) {
        throw new Error("No asset found for this user");
      }
      const sanitizedAsset = {
        policyID: assetToSanitize.policyID,
        assetName: assetToSanitize.assetName,
        amount: assetToSanitize.amount,
      };

      const sanitizedUser = {
        stakeAddress: user.walletAddress as string,
        walletNetwork: user.walletNetwork as number,
        asset: sanitizedAsset,
      };

      const isValid = await loginUser(sanitizedUser, {
        stakeAddress: walletAddress,
        walletNetwork,
        signature,
        key,
        nonce,
        assets: [asset],
      });
      if (!isValid.success) {
        return new Response("Invalid credentials", { status: 401 });
      }
    } else {
      if (user.assets.length !== 0) {
        return new Response("Asset details required for this user", { status: 400 });
      }

      const sanitizedUser = {
        stakeAddress: user.walletAddress as string,
        walletNetwork: user.walletNetwork as number,
      };

      if (user.verifiedPolicy === "admin") {
        verifiedPolicy = "admin";
      }
      const isValid = await loginUser(sanitizedUser, {
        stakeAddress: walletAddress,
        walletNetwork,
        signature,
        key,
        nonce
      });
      if (!isValid.success) {
        return new Response("Invalid credentials", { status: 401 });
      }
    }
  }
  else {
    return new Response("Invalid request", { status: 400 });
  }


  // Prepare the JWT secret and algorithm
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const alg = "HS256";

  // Create and sign a new JWT
  const jwt = await new jose.SignJWT({
    id: user.id,
    walletAddress: user.walletAddress,
    email: user.email,
    walletNetwork: user.walletNetwork,
    verifiedPolicy: verifiedPolicy
  })
    .setProtectedHeader({ alg }) // Set the algorithm in the protected header
    .setIssuedAt() // Set the issued at time
    .setIssuer("littlefish") // Set the issuer
    .setSubject(user.id) // Set the subject to the user ID
    .setExpirationTime("2h") // Set the expiration time to 2 hours
    .sign(secret); // Sign the JWT with the secret

  // Return a response with the signed JWT
  return new Response(JSON.stringify({ token: jwt }), { status: 200, headers: { "Content-Type": "application/json" } });
}
