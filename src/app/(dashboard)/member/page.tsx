import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function MemberHome() {
  const session = await auth();
  if (!session || session.user.role !== "member") redirect("/coach");

  const memberships = await prisma.challengeMember.findMany({
    where: { userId: session.user.id },
    include: {
      challenge: { include: { tasks: true } },
    },
  });

  const activeChallenge = memberships.find((m) => m.challenge.active)?.challenge;

  let streak = 0;
  let progressPct = 0;
  let todayCheckin = null;

  if (activeChallenge) {
    const checkins = await prisma.dailyCheckin.findMany({
      where: { userId: session.user.id, challengeId: activeChallenge.id },
      orderBy: { date: "desc" },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    todayCheckin = checkins.find((c) => new Date(c.date).getTime() === today.getTime());

    for (let i = 0; i < checkins.length; i++) {
      const expected = new Date(today);
      expected.setDate(expected.getDate() - i);
      expected.setHours(0, 0, 0, 0);
      if (new Date(checkins[i].date).getTime() === expected.getTime()) {
        streak++;
      } else break;
    }

    const totalDays = Math.ceil(
      (new Date(activeChallenge.endDate).getTime() - new Date(activeChallenge.startDate).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    progressPct = totalDays > 0 ? Math.round((checkins.length / totalDays) * 100) : 0;
  }

  return (
    <div className="space-y-5 stagger">
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900">Hey, {session.user.name} 👋</h2>
        <p className="text-gray-500 text-sm mt-1">You&apos;re making progress. Keep going.</p>
      </div>

      {activeChallenge ? (
        <>
          {/* Streak + Progress */}
          <div className="grid grid-cols-3 gap-3">
            <div className="stat-card text-center col-span-1">
              <div className="w-14 h-14 mx-auto bg-[#c4a882]/15 rounded-full flex items-center justify-center streak-pulse">
                <span className="text-2xl">🔥</span>
              </div>
              <p className="text-2xl font-extrabold text-[#c4a882] mt-2">{streak}</p>
              <p className="text-[10px] text-gray-500 font-medium">Day Streak</p>
            </div>
            <div className="stat-card col-span-2">
              <p className="text-xs font-semibold text-gray-500 mb-1">Challenge Progress</p>
              <p className="text-2xl font-extrabold text-[#5f7a6a]">{progressPct}%</p>
              <div className="w-full bg-[#e8ddd0]/50 rounded-full h-2.5 mt-2 overflow-hidden">
                <div
                  className="progress-bar h-2.5 rounded-full"
                  style={{ width: `${Math.min(progressPct, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-2 truncate">{activeChallenge.title}</p>
            </div>
          </div>

          {/* Today's Tasks */}
          <div className="card">
            <h3 className="font-bold text-gray-800 mb-3">Today&apos;s Tasks</h3>
            <ul className="space-y-2.5">
              {activeChallenge.tasks.map((task) => (
                <li key={task.id} className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs shrink-0 ${
                    todayCheckin
                      ? "bg-[#5f7a6a]/10 border-[#5f7a6a] text-[#5f7a6a]"
                      : "border-[#e8ddd0]"
                  }`}>
                    {todayCheckin ? "✓" : ""}
                  </span>
                  <span className={`text-sm ${todayCheckin ? "text-gray-400 line-through" : "text-gray-700"}`}>
                    {task.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          {!todayCheckin ? (
            <Link
              href="/member/checkin"
              className="btn-primary block text-center w-full text-lg py-4"
            >
              ✅ Complete Today&apos;s Check-In
            </Link>
          ) : (
            <div className="bg-[#5f7a6a]/10 text-[#3d5a4a] text-center py-4 rounded-2xl font-semibold border border-[#5f7a6a]/20">
              ✓ You&apos;ve checked in today! Great job! 🎉
            </div>
          )}
        </>
      ) : (
        <div className="card text-center py-12">
          <p className="text-5xl mb-4">🌿</p>
          <p className="text-gray-700 font-semibold">No active challenges</p>
          <p className="text-sm text-gray-400 mt-1">Ask your coach for an invite link</p>
        </div>
      )}
    </div>
  );
}
