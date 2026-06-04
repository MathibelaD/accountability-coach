"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const coachNav = [
  { href: "/coach", label: "Dashboard", icon: "📊" },
  { href: "/coach/products", label: "Products", icon: "📦" },
  { href: "/coach/challenges/new", label: "Create Challenge", icon: "➕" },
  { href: "/coach/reminders", label: "Reminders", icon: "💬" },
];

const memberNav = [
  { href: "/member", label: "Dashboard", icon: "🏠" },
  { href: "/member/checkin", label: "Daily Check-In", icon: "✅" },
  { href: "/member/progress", label: "Progress", icon: "📈" },
  { href: "/member/community", label: "Community", icon: "👥" },
  { href: "/member/products", label: "Products", icon: "📦" },
  { href: "/member/achievements", label: "Achievements", icon: "🏆" },
];

export function SideNav({ role, name }: { role: string; name: string }) {
  const pathname = usePathname();
  const nav = role === "coach" ? coachNav : memberNav;

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 bg-white border-r border-[#e8ddd0]/60">
      {/* Brand */}
      <div className="p-6 border-b border-[#e8ddd0]/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#5f7a6a] rounded-xl flex items-center justify-center">
            <span className="text-lg">🌿</span>
          </div>
          <div>
            <h1 className="font-bold text-gray-900">AccountaBuddy</h1>
            <p className="text-xs text-gray-500 capitalize">{role} Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {nav.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-[#5f7a6a]/10 text-[#3d5a4a]"
                  : "text-gray-600 hover:bg-[#f9f6f2] hover:text-gray-900"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-[#e8ddd0]/60">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-9 h-9 bg-[#5f7a6a]/10 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold text-[#5f7a6a]">
              {name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
            <p className="text-xs text-gray-500 capitalize">{role}</p>
          </div>
        </div>
        <button
          onClick={async () => {
            await signOut({ redirect: false });
            window.location.href = "/login";
          }}
          className="w-full mt-3 px-4 py-3 text-sm font-semibold text-white bg-[#c45d4a] hover:bg-[#b04d3d] rounded-xl transition-all active:scale-95 text-center"
        >
          Log Out
        </button>
      </div>
    </aside>
  );
}
