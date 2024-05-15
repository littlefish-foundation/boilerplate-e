"use client";
import { WalletProvider } from "littlefish-nft-auth-framework-beta";
import { AuthProvider } from "./AuthContext";

export default function Providers({ children }: any) {
  return (
    <AuthProvider>
      <WalletProvider>{children}</WalletProvider>
    </AuthProvider>
  );
}
