"use client";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import Providers from "./Providers";
import { useEffect, useState } from "react";
import SessionWrapper from "@/components/SessionWrapper";

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
              <Providers>{children}</Providers>
            </Dynamic>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </SessionWrapper>
  );
}
