import { SiteHeader } from "@/components/site-header";
// import { Sidebar } from "@/components/sidebar"; // You'll need to create this component

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
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
/*
import { SiteHeader } from "@/components/site-header";
import { Sidebar } from "@/components/sidebar"; // You'll need to create this component

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="flex h-[calc(100vh-3.5rem)]">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

*/