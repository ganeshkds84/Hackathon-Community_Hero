import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

type SiteLayoutProps = {
  children: React.ReactNode;
};

export function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container flex-1 py-8 md:py-12">{children}</main>
      <Footer />
    </div>
  );
}
