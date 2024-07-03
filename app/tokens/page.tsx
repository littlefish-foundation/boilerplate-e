import React from "react";
import TokenList from "../../components/nft-auth/token-list";
import { MetadataProvider } from '@/contexts/MetadataContext';
import WalletMetadataFetcher from '@/components/nft-auth/WalletMetadataFetcher';

export default function Page() {
  return (
    <div className="container h-screen w-screen flex-col items-center justify-center">
      <MetadataProvider>
        <WalletMetadataFetcher />
        <TokenList />
      </MetadataProvider>
    </div>
  );
}