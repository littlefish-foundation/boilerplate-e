import NextAuth, { type DefaultSession} from "next-auth";
import Credentials from  "next-auth/providers/credentials"; 
import prisma from "./app/lib/prisma";
import { loginUser } from "littlefish-nft-auth-framework/backend";

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface User {
    walletAddress: string;
    walletNetwork: number;
    key: string;
    nonce: string;
    signature: string;
  }
  }

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Credentials({
    credentials: {
      walletAddress: { label: "Wallet Address", type: "text" } || null,
      walletNetwork: { label: "Wallet Network", type: "number" } || null,
      signature: { label: "Signature", type: "text" } || null,
      key: { label: "Key", type: "text" } || null,
      nonce: { label: "Nonce", type: "text" } || null,
    },
    authorize: async (credentials) => {
      const user = await prisma.user.findUnique({
        where: {
          walletAddress: credentials.walletAddress,
        },
      });
      if (!user) {
        throw new Error("No user found");
      }
      const sanitizedUser = {
        
        stakeAddress: user.walletAddress,
        walletNetwork: user.walletNetwork
      };
      const isValid = await loginUser(sanitizedUser, credentials)
      if (isValid.success) {
        return user;
      }
      return null;
    }
  })],
})