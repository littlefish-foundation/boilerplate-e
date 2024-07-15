import { Metadata } from 'next'
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import ClientProviders from "./ClientProviders";


const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Littlefish Foundation',
    description: 'Welcome to the Littlefish Foundation',
  }
}

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