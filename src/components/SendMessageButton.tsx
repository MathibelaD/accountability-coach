"use client";
import { useState } from "react";

const quickMessages = [
  { label: "💪 Keep Going", message: "Keep going! You're doing amazing!" },
  { label: "🫶 We Miss You", message: "We miss you! Come back and check in today!" },
  { label: "🌟 Great Progress", message: "Great progress! Keep up the momentum!" },
  { label: "🔥 Don't Give Up", message: "Don't give up! You've come so far!" },
];

export function SendMessageButton({ challengeId }: { challengeId: string }) {
  const [open, setOpen] = useState(false);

  async function send(message: string) {
    await fetch("/api/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ challengeId, message, type: "motivation" }),
    });
    setOpen(false);
  }

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="text-lg" aria-label="Send encouragement">
        💬
      </button>
      {open && (
        <div className="absolute right-0 top-8 z-20 bg-white rounded-xl shadow-lg border p-2 w-48 space-y-1">
          {quickMessages.map((m) => (
            <button
              key={m.label}
              onClick={() => send(m.message)}
              className="block w-full text-left text-sm px-3 py-2 rounded-lg hover:bg-gray-50"
            >
              {m.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
