"use client";
import { WalletProvider } from "littlefish-nft-auth-framework-beta";

export default function Providers({ children }: any) {
  return <WalletProvider>{children}</WalletProvider>;
};