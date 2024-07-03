// Remove the "use client" directive from here

import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import SessionWrapper from "@/components/SessionWrapper";
import ClientProviders from "./ClientProviders"; // We'll create this new component

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionWrapper>
      <html lang="en">
        <body className={`min-h-screen bg-background font-sans antialiased ${fontSans.variable}`}>
          <ClientProviders>{children}</ClientProviders>
        </body>
      </html>
    </SessionWrapper>
  );
}

/*
"use client";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import Providers from "./Providers";
import { useEffect, useState } from "react";
import SessionWrapper from "@/components/SessionWrapper";
import { MetadataProvider } from '@/contexts/MetadataContext';
import WalletMetadataFetcher from '@/components/nft-auth/WalletMetadataFetcher';

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const Dynamic = ({ children }: { children: React.ReactNode }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <>{children}</>;
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionWrapper>
      <html lang="en">
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <Dynamic>
              <Providers>
                <MetadataProvider>
                  <WalletMetadataFetcher />
                  {children}
                </MetadataProvider>
              </Providers>
            </Dynamic>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </SessionWrapper>
  );
}
  */