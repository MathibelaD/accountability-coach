"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const coachNav = [
  { href: "/coach", label: "Home", icon: "🏠" },
  { href: "/coach/challenges/new", label: "Create", icon: "➕" },
  { href: "/coach/reminders", label: "Remind", icon: "💬" },
];

const memberNav = [
  { href: "/member", label: "Home", icon: "🏠" },
  { href: "/member/checkin", label: "Check In", icon: "✅" },
  { href: "/member/progress", label: "Progress", icon: "📊" },
  { href: "/member/achievements", label: "Streaks", icon: "🔥" },
];

export function BottomNav({ role }: { role: string }) {
  const pathname = usePathname();
  const nav = role === "coach" ? coachNav : memberNav;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-2 pb-safe">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {nav.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all ${
                active ? "text-indigo-600" : "text-gray-400"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
