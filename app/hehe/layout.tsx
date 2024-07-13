import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

interface AssetsLayoutProps {
  children: React.ReactNode;
}

export default async function AssetsLayout({
  children,
}: AssetsLayoutProps) {
  return (
    <>
      {/* <SiteBanner /> */}
      <SiteHeader />
      <main className="mx-auto flex-1 overflow-hidden">{children}</main>
    </>
  );
}
