import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BottomNav } from "@/components/BottomNav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="min-h-dvh pb-20 max-w-lg mx-auto">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <h1 className="font-bold text-lg text-gray-900">AccountaBuddy</h1>
        <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full capitalize">
          {session.user.role}
        </span>
      </header>
      <main className="p-4">{children}</main>
      <BottomNav role={session.user.role} />
    </div>
  );
}
