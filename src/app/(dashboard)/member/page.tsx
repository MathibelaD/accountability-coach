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

  // Calculate streak
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

    // Streak calc
    for (let i = 0; i < checkins.length; i++) {
      const expected = new Date(today);
      expected.setDate(expected.getDate() - i);
      expected.setHours(0, 0, 0, 0);
      if (new Date(checkins[i].date).getTime() === expected.getTime()) {
        streak++;
      } else break;
    }

    // Progress: days completed / total days
    const totalDays = Math.ceil(
      (new Date(activeChallenge.endDate).getTime() - new Date(activeChallenge.startDate).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    progressPct = totalDays > 0 ? Math.round((checkins.length / totalDays) * 100) : 0;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Hey, {session.user.name} 👋</h2>

      {activeChallenge ? (
        <>
          {/* Current Challenge Card */}
          <div className="card">
            <h3 className="font-semibold text-gray-900">{activeChallenge.title}</h3>
            <div className="flex items-center gap-4 mt-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-500">🔥 {streak}</p>
                <p className="text-[10px] text-gray-500">Day Streak</p>
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">Progress</span>
                  <span className="font-bold text-indigo-600">{progressPct}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div
                    className="bg-indigo-500 h-3 rounded-full"
                    style={{ width: `${Math.min(progressPct, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Today's Tasks */}
          <div className="card">
            <h3 className="font-semibold text-gray-700 mb-2">Today&apos;s Tasks</h3>
            <ul className="space-y-2">
              {activeChallenge.tasks.map((task) => (
                <li key={task.id} className="flex items-center gap-2 text-sm text-gray-600">
                  <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs ${
                    todayCheckin ? "bg-green-100 border-green-400 text-green-600" : "border-gray-300"
                  }`}>
                    {todayCheckin ? "✓" : ""}
                  </span>
                  {task.name}
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          {!todayCheckin && (
            <Link href="/member/checkin" className="btn-primary block text-center w-full text-lg">
              ✅ Complete Today&apos;s Check-In
            </Link>
          )}
          {todayCheckin && (
            <div className="bg-green-50 text-green-700 text-center py-4 rounded-2xl font-medium">
              ✓ You&apos;ve checked in today! Great job! 🎉
            </div>
          )}
        </>
      ) : (
        <div className="card text-center py-8">
          <p className="text-4xl mb-3">🎯</p>
          <p className="text-gray-500">No active challenges</p>
          <p className="text-sm text-gray-400 mt-1">Ask your coach for an invite link</p>
        </div>
      )}
    </div>
  );
}
