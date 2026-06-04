"use client";
import { useState, useEffect } from "react";

const badges = [
  { name: "First Check-In", icon: "⭐", requirement: 1 },
  { name: "7-Day Streak", icon: "🔥", requirement: 7 },
  { name: "14-Day Streak", icon: "💎", requirement: 14 },
  { name: "30-Day Streak", icon: "🏆", requirement: 30 },
];

export default function AchievementsPage() {
  const [checkins, setCheckins] = useState<any[]>([]);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    fetch("/api/checkins")
      .then((r) => r.json())
      .then((data) => {
        setCheckins(data);
        // Calculate current streak
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        let s = 0;
        const sorted = data.sort(
          (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        for (let i = 0; i < sorted.length; i++) {
          const expected = new Date(today);
          expected.setDate(expected.getDate() - i);
          expected.setHours(0, 0, 0, 0);
          if (new Date(sorted[i].date).toDateString() === expected.toDateString()) {
            s++;
          } else break;
        }
        setStreak(s);
      });
  }, []);

  // Weekly consistency
  const thisWeekCheckins = checkins.filter((c) => {
    const d = new Date(c.date);
    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);
    return d >= weekAgo;
  }).length;

  // Monthly consistency
  const thisMonthCheckins = checkins.filter((c) => {
    const d = new Date(c.date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Achievements 🏆</h2>

      {/* Current Streak */}
      <div className="card text-center py-6">
        <p className="text-5xl mb-2">🔥</p>
        <p className="text-3xl font-bold text-orange-500">{streak}</p>
        <p className="text-sm text-gray-500">Day Streak</p>
      </div>

      {/* Consistency */}
      <div className="grid grid-cols-2 gap-3">
        <div className="card text-center">
          <p className="text-2xl font-bold text-indigo-600">{thisWeekCheckins}/7</p>
          <p className="text-xs text-gray-500">This Week</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-indigo-600">{thisMonthCheckins}</p>
          <p className="text-xs text-gray-500">This Month</p>
        </div>
      </div>

      {/* Badges */}
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-700">Badges</h3>
        {badges.map((badge) => {
          const earned = checkins.length >= badge.requirement;
          return (
            <div
              key={badge.name}
              className={`card flex items-center gap-3 ${earned ? "" : "opacity-40"}`}
            >
              <span className="text-3xl">{badge.icon}</span>
              <div>
                <p className="font-medium text-gray-900">{badge.name}</p>
                <p className="text-xs text-gray-500">
                  {earned ? "Earned! ✓" : `${badge.requirement} check-ins needed`}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
