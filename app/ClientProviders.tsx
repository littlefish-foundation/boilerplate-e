"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import Providers from "./Providers";
import { MetadataProvider } from '@/contexts/MetadataContext';
import WalletMetadataFetcher from '@/components/nft-auth/WalletMetadataFetcher';
import { useEffect, useState } from "react";

const ClientProviders = ({ children }: { children: React.ReactNode }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <Providers>
        <MetadataProvider>
          <WalletMetadataFetcher />
          {children}
        </MetadataProvider>
      </Providers>
      <Toaster />
    </ThemeProvider>
  );
};

export default ClientProviders;