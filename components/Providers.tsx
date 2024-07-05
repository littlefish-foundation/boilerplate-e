"use client";
import { WalletProvider } from "littlefish-nft-auth-framework/frontend";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return <WalletProvider>{children}</WalletProvider>;
};

export default Providers;