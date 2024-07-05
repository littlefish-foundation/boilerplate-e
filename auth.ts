import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "./app/lib/prisma";
import { loginUser, setConfig } from "littlefish-nft-auth-framework/backend";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { Adapter } from "next-auth/adapters";

const config = {
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
};

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */

  interface User {
    id?: string;
    name?: string | null;
    email?: string | null;
    emailVerified?: Date | null;
    password?: string | null;
    walletAddress?: string | null;
    walletAddressVerified?: Date | null;
    walletNetwork?: number | null;
    verifiedPolicy?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
  }

  interface Session {
    user: {
      walletAddress: string;
      walletNetwork: number;
    } & DefaultSession["user"];
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  trustHost: true,
  adapter: PrismaAdapter(prisma) as Adapter,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.walletAddress = user.walletAddress;
        token.walletNetwork = user.walletNetwork;
        token.verifiedPolicy = user.verifiedPolicy;
      }
      return token;
    },
    session: async ({ session, token }) => {
      session.user.walletAddress = token.walletAddress as string;
      session.user.walletNetwork = token.walletNetwork as number;
      session.user.verifiedPolicy = token.verifiedPolicy as string;
      return session;
    },
  },
  providers: [
    Credentials({
      name: "wallet",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        walletAddress: { label: "Wallet Address", type: "text" },
        walletNetwork: { label: "Wallet Network", type: "number" },
        signature: { label: "Signature", type: "text" },
        key: { label: "Key", type: "text" },
        nonce: { label: "Nonce", type: "text" },
        policyID: { label: "Policy ID", type: "text" },
        assetName: { label: "Asset Name", type: "text" },
        amount: { label: "Amount", type: "number" },
      },
      authorize: async (credentials) => {
        if (!credentials) {
          throw new Error("No credentials provided");
        }
        if (credentials.email && credentials.password) {
          const email = credentials.email as string;
          const password = credentials.password as string;
          
          const user = await prisma.user.findUnique({
            where: {
              email: email,
            },
            include: {
              assets: true,
            },
          });

          if (!user) {
            throw new Error("No user found");
          }

          if (user.assets.length !== 0) {
            throw new Error("Asset details required for this user");
          }

          const sanitizedUser = {
            email: user.email as string,
            password: user.password as string,
          };
          
          const isValid = await loginUser(sanitizedUser, {
            email,
            password,
          });

          if (isValid.success) {
            return user;
          } else {
            throw new Error("Invalid credentials");
          }
        }

        const walletAddress = credentials.walletAddress as string;
        const walletNetwork = parseInt(
          credentials.walletNetwork as string,
          10
        );
        const signature = credentials.signature as string;
        const key = credentials.key as string;
        const nonce = credentials.nonce as string;
        if (
          !credentials.policyID ||
          !credentials.assetName ||
          !credentials.amount
        ) {
          const user = await prisma.user.findUnique({
            where: {
              walletAddress: walletAddress,
            },
            include: {
              assets: true,
            },
          });

          if (!user) {
            throw new Error("No user found");
          }

          if (user.assets.length !== 0) {
            throw new Error("Asset details required for this user");
          }
          const sanitizedUser = {
            stakeAddress: user.walletAddress as string,
            walletNetwork: user.walletNetwork as number,
          };
          const isValid = await loginUser(sanitizedUser, {
            stakeAddress: walletAddress,
            walletNetwork,
            signature,
            key,
            nonce,
          });
          if (isValid.success) {
            return user;
          } else {
            throw new Error("Invalid credentials");
          }
        } else {
          const asset = {
            policyID: credentials.policyID as string, assetName: credentials.assetName as string, amount: parseInt(
              credentials.amount as string,
              10
            )
          };
          const networkConfig = config[walletNetwork as keyof typeof config];
          if (!networkConfig || !networkConfig.apiKey) {
            throw new Error(
              "Configuration for the provided network is missing or incomplete."
            );
          }
          setConfig(networkConfig.apiKey, networkConfig.networkId);
          const assets = [asset];

          const user = await prisma.user.findUnique({
            where: {
              walletAddress: walletAddress,
            }, include: {
              assets: true,
            },
          });

          if (!user) {
            throw new Error("No user found");
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
            assets,
          });
          if (isValid.success) {
            return user;
          } else {
            throw new Error("Invalid credentials");
          }
        }
      }
    }),
  ],
});
