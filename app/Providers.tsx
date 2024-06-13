"use client";
import { WalletProvider } from "littlefish-nft-auth-framework/frontend";

export default function Providers({ children }: any) {
  return <WalletProvider>{children}</WalletProvider>;
}
