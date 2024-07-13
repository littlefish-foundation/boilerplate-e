// /app/layout.tsx
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import ClientProviders from "./ClientProviders";

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
    <html lang="en">
      <body className={`min-h-screen bg-background font-sans antialiased ${fontSans.variable}`}>
          <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}

/*
ClientProviders <- import { ThemeProvider } from "@/components/theme-provider";
ClientProviders <- import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
here - import { Inter as FontSans } from "next/font/google";
here - import "./globals.css";
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

*/