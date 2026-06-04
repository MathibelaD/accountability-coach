"use client";
import { useState, useEffect } from "react";

export default function RemindersPage() {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    fetch("/api/challenges").then((r) => r.json()).then(setChallenges);
  }, []);

  async function handleSend(type: string, msg?: string) {
    if (!selectedChallenge) return;
    await fetch("/api/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ challengeId: selectedChallenge, message: msg || message, type }),
    });
    setMessage("");
    setSent(true);
    setTimeout(() => setSent(false), 2000);
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Reminder Center</h2>

      <select
        value={selectedChallenge}
        onChange={(e) => setSelectedChallenge(e.target.value)}
        className="input"
      >
        <option value="">Select Challenge</option>
        {challenges.map((c: any) => (
          <option key={c.id} value={c.id}>{c.title}</option>
        ))}
      </select>

      {sent && (
        <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl text-sm">✓ Message sent!</div>
      )}

      {/* Quick Messages */}
      <div className="card space-y-2">
        <h3 className="font-semibold text-gray-700 text-sm">Quick Encouragements</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "💪 Keep Going", msg: "Keep going everyone! You're doing amazing!" },
            { label: "🫶 We Miss You", msg: "We miss you! Come back and check in!" },
            { label: "🌟 Great Progress", msg: "The group is making great progress! Keep it up!" },
            { label: "🔥 Don't Give Up", msg: "Don't give up now! You've come so far!" },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => handleSend("motivation", item.msg)}
              disabled={!selectedChallenge}
              className="py-3 px-2 bg-gray-50 hover:bg-indigo-50 rounded-xl text-sm font-medium disabled:opacity-50 transition-all active:scale-95"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Message */}
      <div className="card space-y-3">
        <h3 className="font-semibold text-gray-700 text-sm">Custom Announcement</h3>
        <textarea
          placeholder="Write your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="input min-h-[100px]"
        />
        <button
          onClick={() => handleSend("announcement")}
          disabled={!selectedChallenge || !message}
          className="btn-primary w-full disabled:opacity-50"
        >
          Send Announcement
        </button>
      </div>
    </div>
  );
}
