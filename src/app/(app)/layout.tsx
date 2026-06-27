import Sidebar from "@/components/Sidebar";
import AdaptationBanner from "@/components/AdaptationBanner";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar />
      <main className="flex-1 bg-page">{children}</main>
      <AdaptationBanner />
    </div>
  );
}
