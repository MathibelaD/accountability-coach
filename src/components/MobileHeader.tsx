"use client";
import { signOut } from "next-auth/react";

export function MobileHeader() {
  return (
    <header className="md:hidden sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-[#e8ddd0]/60 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-[#5f7a6a] rounded-lg flex items-center justify-center">
          <span className="text-sm">🌿</span>
        </div>
        <h1 className="font-bold text-gray-900">AccountaBuddy</h1>
      </div>
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="text-xs text-[#c45d4a] font-medium px-2.5 py-1 rounded-full hover:bg-[#c45d4a]/10 transition-all"
      >
        Sign Out
      </button>
    </header>
  );
}
