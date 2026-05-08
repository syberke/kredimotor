import MarketingSidebar from "@/components/shared/MarketingSideBar";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="
      flex
      min-h-screen
      bg-slate-50
    ">

      <MarketingSidebar />

      <main className="
        flex-1
        overflow-y-auto
      ">
        {children}
      </main>

    </div>
  );
}