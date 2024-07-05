// /app/dashboard/layout.tsx
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  );
}
/*

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";


interface DashboardProps {
  children: React.ReactNode;
}

export default async function Dashboard({
  children,
}: DashboardProps) {
  return (
    <>
     
        <SiteHeader />
          <main className="mx-auto flex-1 overflow-hidden">{children}</main>
        <SiteFooter />
    </>
  );
}

*/