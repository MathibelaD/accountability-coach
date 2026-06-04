"use client";
import { useState } from "react";

export function InviteLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="card">
      <p className="text-xs font-semibold text-gray-500 mb-1">Invite Link</p>
      <div className="flex items-center gap-2">
        <code className="flex-1 text-xs bg-[#f9f6f2] text-[#3d5a4a] p-2.5 rounded-lg break-all border border-[#e8ddd0]/60">
          {url}
        </code>
        <button
          onClick={handleCopy}
          className={`shrink-0 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all active:scale-95 ${
            copied
              ? "bg-[#5f7a6a] text-white"
              : "bg-[#5f7a6a]/10 text-[#3d5a4a] hover:bg-[#5f7a6a]/20"
          }`}
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>
    </div>
  );
}
