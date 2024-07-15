// layout.tsx or a parent component

"use client";
import { useEffect } from 'react';
import { SiteHeader } from "@/components/site-header";

import { useWallet } from "littlefish-nft-auth-framework/frontend";
import { convertHexToBech32 } from "littlefish-nft-auth-framework/backend";

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { isConnected, addresses, networkID } = useWallet();
  

 

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="flex h-[calc(100vh-3.5rem)]">
        <main className="flex-1 overflow-y-auto p-20">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    
      <DashboardContent>{children}</DashboardContent>
    
  );
}