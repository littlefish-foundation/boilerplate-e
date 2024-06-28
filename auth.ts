import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "./app/lib/prisma";
import { loginUser } from "littlefish-nft-auth-framework/backend";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { Adapter } from "next-auth/adapters";

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
          });

          if (!user) {
            throw new Error("No user found");
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
          console.log("isValid", isValid);
          if (isValid.success) {
            return user;
          } else {
            throw new Error("Invalid credentials");
          }
        } else {
          const asset = { policyID: credentials.policyID as string, assetName: credentials.assetName as string, amount: credentials.amount as number };
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

          const sanitizedAsset = user.assets.find((matchingAsset) => matchingAsset.policyID === asset.policyID && matchingAsset.assetName === asset.assetName);

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
          console.log("isValid", isValid);
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
