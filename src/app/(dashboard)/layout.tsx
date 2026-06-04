import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BottomNav } from "@/components/BottomNav";
import { SideNav } from "@/components/SideNav";
import { MobileHeader } from "@/components/MobileHeader";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="min-h-dvh md:flex">
      <SideNav role={session.user.role} name={session.user.name || "User"} />

      <div className="flex-1 md:ml-64">
        <MobileHeader />

        <main className="p-4 pb-24 md:p-6 md:pb-6">
          {children}
        </main>
      </div>

      <BottomNav role={session.user.role} />
    </div>
  );
}
