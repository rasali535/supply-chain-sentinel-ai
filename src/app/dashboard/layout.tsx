import { Sidebar } from "../../components/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex bg-slate-950 text-slate-50 overflow-hidden font-sans">
      <div className="hidden md:flex md:w-72 md:flex-col inset-y-0 z-50">
        <Sidebar />
      </div>
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
