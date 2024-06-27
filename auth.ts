import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "./app/lib/prisma";
import { loginUser } from "littlefish-nft-auth-framework/backend";

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */

  interface user {
    id: string;
    name: string | null;
    email: string | null;
    emailVerified: Date | null;
    password: string | null;
    walletAddress: string | null;
    walletAddressVerified: Date | null;
    walletNetwork: number | null;
    verifiedPolicy: string | null;
    createdAt: Date;
    updatedAt: Date;
}
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Credentials({
    name: "Cardano Wallet",
    credentials: {
      walletAddress: { label: "Wallet Address", type: "text" },
      walletNetwork: { label: "Wallet Network", type: "number" },
      signature: { label: "Signature", type: "text" },
      key: { label: "Key", type: "text" },
      nonce: { label: "Nonce", type: "text" },
    },
    authorize: async (credentials) => {
      if (!credentials) {
        throw new Error("No credentials provided");
      }
      const { walletAddress, walletNetwork, signature, key, nonce } = credentials as {
        walletAddress: string;
        walletNetwork: number;
        signature: string;
        key: string;
        nonce: string;
      };

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
      const isValid = await loginUser(sanitizedUser, {stakeAddress: walletAddress, walletNetwork, signature, key, nonce})
      if (isValid.success) {
        return user;
      } else {
        throw new Error("Invalid credentials");
      }
    }
  })],
})