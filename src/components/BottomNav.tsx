"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const coachNav = [
  { href: "/coach", label: "Home", icon: "📊" },
  { href: "/coach/products", label: "Products", icon: "📦" },
  { href: "/coach/challenges/new", label: "Create", icon: "➕" },
  { href: "/coach/reminders", label: "Remind", icon: "💬" },
];

const memberNav = [
  { href: "/member", label: "Home", icon: "🏠" },
  { href: "/member/checkin", label: "Check In", icon: "✅" },
  { href: "/member/products", label: "Products", icon: "📦" },
  { href: "/member/progress", label: "Progress", icon: "📈" },
];

export function BottomNav({ role }: { role: string }) {
  const pathname = usePathname();
  const nav = role === "coach" ? coachNav : memberNav;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-[#e8ddd0] px-2 pb-safe z-20">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {nav.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
                active
                  ? "text-[#3d5a4a] bg-[#5f7a6a]/10"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[10px] font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
