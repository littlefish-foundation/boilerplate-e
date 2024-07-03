import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";


interface DashboardProps {
  children: React.ReactNode;
}

export default function Dashboard({
  children,
}: DashboardProps) {
  return (
    <>
      
        <SiteHeader />
        <main className="relativemx-auto flex-1 overflow-hidden">{children}</main>
        <SiteFooter />
    </>
  );
}