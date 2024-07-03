import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { MetadataProvider } from '@/contexts/MetadataContext';
import WalletMetadataFetcher from '@/components/nft-auth/WalletMetadataFetcher';

interface DashboardProps {
  children: React.ReactNode;
}

export default function Dashboard({
  children,
}: DashboardProps) {
  return (
    <>
      <MetadataProvider>
        <WalletMetadataFetcher />
        <SiteHeader />
        <main className="relativemx-auto flex-1 overflow-hidden">{children}</main>
        <SiteFooter />
      </MetadataProvider>
    </>
  );
}