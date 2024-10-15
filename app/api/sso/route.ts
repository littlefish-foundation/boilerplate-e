import prisma from "@/app/lib/prisma";
import {
  setConfig,
  Sso,
  convertHexToBech32,
} from "littlefish-nft-auth-framework/backend";
import { Asset } from "littlefish-nft-auth-framework/frontend";
import * as jose from "jose";

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
// Define the POST function to handle SSO requests
export async function POST(request: Request) {
  // Parse the incoming JSON request body
  const body = await request.json();
  const config = getConfig();
  const networkConfig = config[body.walletNetwork as keyof typeof config];
  if (!networkConfig || !networkConfig.apiKey) {
    return new Response(
      JSON.stringify({ error: "Invalid network configuration" }),
      { status: 400 }
    );
  }
  setConfig(networkConfig.apiKey, networkConfig.networkId);

  const issuer = process.env.ISSUER;
  const uniqueIdentifiers = await prisma.identifiers.findMany({});

  let user;
  let role;

  if (!issuer || !uniqueIdentifiers) {
    return new Response(
      JSON.stringify({ error: "Issuer or Unique Identifier not set" }),
      {
        status: 400,
      }
    );
  }

  user = await prisma.user.findFirst({
    where: {
      walletAddress: body.walletAddress,
    },
    include: { assets: true, ssoData: true },
  });
  if (user) {
    const ssoData = user.ssoData;
    let count;
    count = ssoData[0].usageCount;
    if (!count) {
      count = 0;
    }
    let lastUsage;
    lastUsage = ssoData[0].lastUsed;
    if (!lastUsage) {
      lastUsage = new Date();
    }
    const assetToSanitize = user.assets.find(
      (matchingAsset: Asset) =>
        matchingAsset.policyID === body.policyID &&
        matchingAsset.assetName === body.assetName
    );
    if (!assetToSanitize) {
      return new Response(JSON.stringify({ error: "asset mismatch" }), {
        status: 400,
      });
    }

    const ssoCheck = await Sso({
      stakeAddress: body.walletAddress,
      walletNetwork: body.walletNetwork,
      signature: body.signature,
      key: body.key,
      nonce: body.nonce,
      asset: {
        policyID: body.policyID,
        assetName: body.assetName,
        amount: body.amount,
      },
      issuerOption: issuer,
      platformUniqueIdentifiers: uniqueIdentifiers.map(
        (identifier) => identifier.identifier
      ),
      usageCount: count,
      lastUsage: lastUsage.toISOString(),
    });
    console.log(ssoCheck)
    if (!ssoCheck.success) {
      return new Response(JSON.stringify({ error: ssoCheck.error }), {
        status: 400,
      });
    }
    role = ssoCheck.roles?.join(",");
    // if count is a number, update the usageCount in db
    if (count) {
      await prisma.sso.update({
        where: {
          id: ssoData[0].id,
        },
        data: {
          usageCount: count + 1,
          lastUsed: new Date(),
        },
      });
    } else {
      await prisma.sso.update({
        where: {
          id: ssoData[0].id,
        },
        data: {
          lastUsed: new Date(),
        },
      });
    }
  } else {
    // create a new user in db
    const count = 0;
    const lastUsage = new Date();

    const ssoCheck = await Sso({
      stakeAddress: body.walletAddress,
      walletNetwork: body.walletNetwork,
      signature: body.signature,
      key: body.key,
      nonce: body.nonce,
      asset: {
        policyID: body.policyID,
        assetName: body.assetName,
        amount: body.amount,
      },
      issuerOption: issuer,
      platformUniqueIdentifiers: uniqueIdentifiers.map(
        (identifier) => identifier.identifier
      ),
      usageCount: count,
      lastUsage: lastUsage.toISOString(),
    });

    if (!ssoCheck.success) {
      return new Response(JSON.stringify({ error: ssoCheck.error }), {
        status: 400,
      });
    }

    role = ssoCheck.roles?.join(",");
    user = await prisma.user.create({
      data: {
        walletAddress: body.walletAddress,
        walletNetwork: body.walletNetwork,
        walletAddressVerified: new Date(),
        verifiedPolicy: ssoCheck.roles?.join(","),
        assets: {
          create: {
            policyID: body.policyID,
            assetName: body.assetName,
            amount: body.amount,
          },
        },
        ssoData: {
          create: {
            policyID: body.policyID,
            usageCount: count + 1,
            lastUsed: lastUsage,
            tiedTo: body.walletAddress,
          },
        },
      },
    });
  }

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const alg = "HS256";

  // Create and sign a new JWT
  const jwt = await new jose.SignJWT({
    id: user.id,
    walletAddress: body.walletAddress,
    walletNetwork: body.walletNetwork,
    policyID: body.policyID,
    assetName: body.assetName,
    amount: body.amount,
    asset: {
      policyID: body.policyID,
      assetName: body.assetName,
      amount: body.amount,
    },
    verifiedPolicy: role,
  })
    .setProtectedHeader({ alg }) // Set the algorithm in the protected header
    .setIssuedAt() // Set the issued at time
    .setIssuer("littlefish") // Set the issuer
    .setSubject(user.id) // Set the subject to the user ID
    .setExpirationTime("2h") // Set the expiration time to 2 hours
    .sign(secret); // Sign the JWT with the secret
  // Return a 200 response indicating success
  return new Response(JSON.stringify({ token: jwt }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
