import prisma from "@/app/lib/prisma";
import { hashPassword, signupUser } from "littlefish-nft-auth-framework/backend";
import { setConfig } from "littlefish-nft-auth-framework/backend";

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
// Define the POST function to handle signup requests
export async function POST(request: Request) {
  // Get all the policy IDs from the database
  //const policies = await prisma.policy.findMany();

  // Parse the incoming JSON request body
  const body = await request.json();
  // add policyIDs to the body
  //if (policies.length > 0) {
  //  const policyIDs = policies.map((policy) => policy.id);
  //  body.authPolicies = policyIDs;
  //}
  body.authPolicies = [
    "dde323780fa3056ed309e20f3ce1b91571b554f3ee2c4683623e3a68",
  ];
  body.authPolicyStrict = false;

  // Call the signupUser function with the request body and get the result
  if (!body.email) {
    const config = getConfig();
    const networkConfig = config[body.walletNetwork as keyof typeof config];
    if (!networkConfig || !networkConfig.apiKey) {
      return new Response(JSON.stringify({ error: "Invalid network configuration" }), { status: 400 });
    }
    setConfig(networkConfig.apiKey, networkConfig.networkId);
  }
  const result = await signupUser(body);
  // If signupUser function returns an error, return an error response
  if (!result.success) {
    return new Response(JSON.stringify({ error: result.error }), {
      status: 400,
    });
  }

  if (result.email && result.passwordHash) {
    // Check if a user with the given email already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        email: result.email,
      },
    });
    if (existingUser) {
      // Return a 400 response if the email already exists
      return new Response(JSON.stringify({ error: "existingUser" }), {
        status: 400,
      });
    }
    result.passwordHash  = hashPassword(result.passwordHash);

    // Create a new user with email and password
    await prisma.user.create({
      data: {
        email: result.email,
        password: result.passwordHash,
        emailVerified: new Date(),
      },
    });
  } else if (result.stakeAddress) {
    // Handle wallet signup
    // Check if a user with the given wallet address already exists
    const existingWalletUser = await prisma.user.findFirst({
      where: {
        walletAddress: result.stakeAddress,
      },
    });

    if (existingWalletUser) {
      // Return a 400 response if the wallet address already exists
      return new Response(JSON.stringify({ error: "existingUser" }), {
        status: 400,
      });
    }
    if (!result.asset) {
      // Create a new user with wallet address and network
      await prisma.user.create({
        data: {
          walletAddress: result.stakeAddress,
          walletNetwork: result.walletNetwork,
          walletAddressVerified: new Date(),
        },
      });
    }
    if (result.asset) {
      if (result.verifiedPolicy) {
        // Create a new user with wallet address, network, and asset details
        await prisma.user.create({
          data: {
            walletAddress: result.stakeAddress,
            walletNetwork: result.walletNetwork,
            walletAddressVerified: new Date(),
            roles: [result.asset.policyID],
            assets: {
              create: {
                policyID: result.asset.policyID,
                assetName: result.asset.assetName,
                amount: result.asset.amount,
              },
            },
          },
        });
      } else {
        await prisma.user.create({
          data: {
            walletAddress: result.stakeAddress,
            walletNetwork: result.walletNetwork,
            walletAddressVerified: new Date(),
            assets: {
              create: {
                policyID: result.asset.policyID,
                assetName: result.asset.assetName,
                amount: result.asset.amount,
              },
            },
          },
        });
      }
    }
  }

  // Return a 200 response indicating success
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
