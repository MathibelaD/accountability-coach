import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function CoachDashboard() {
  const session = await auth();
  if (!session || session.user.role !== "coach") redirect("/member");

  const challenges = await prisma.challenge.findMany({
    where: { coachId: session.user.id },
    include: { members: true, checkins: true },
    orderBy: { createdAt: "desc" },
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const totalMembers = challenges.reduce((sum, c) => sum + c.members.length, 0);
  const todayCheckins = challenges.reduce(
    (sum, c) => sum + c.checkins.filter((ch) => new Date(ch.date) >= today).length,
    0
  );
  const missedToday = totalMembers - todayCheckins;
  const engagement = totalMembers > 0 ? Math.round((todayCheckins / totalMembers) * 100) : 0;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Hey, {session.user.name} 👋</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="card text-center">
          <p className="text-2xl font-bold text-indigo-600">{challenges.length}</p>
          <p className="text-xs text-gray-500">Active Challenges</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-indigo-600">{totalMembers}</p>
          <p className="text-xs text-gray-500">Total Members</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-green-600">{todayCheckins}</p>
          <p className="text-xs text-gray-500">Checked In Today</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-red-500">{missedToday}</p>
          <p className="text-xs text-gray-500">Missed Today</p>
        </div>
      </div>

      {/* Engagement */}
      <div className="card">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Engagement</span>
          <span className="text-sm font-bold text-indigo-600">{engagement}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3">
          <div
            className="bg-indigo-500 h-3 rounded-full transition-all"
            style={{ width: `${engagement}%` }}
          />
        </div>
      </div>

      {/* Challenges List */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-700">Your Challenges</h3>
        {challenges.length === 0 ? (
          <div className="card text-center py-8">
            <p className="text-gray-400 mb-3">No challenges yet</p>
            <Link href="/coach/challenges/new" className="btn-primary inline-block">
              Create Your First Challenge
            </Link>
          </div>
        ) : (
          challenges.map((c) => (
            <Link key={c.id} href={`/coach/challenges/${c.id}`} className="card block">
              <h4 className="font-semibold text-gray-900">{c.title}</h4>
              <p className="text-xs text-gray-500 mt-1">
                {c.members.length} members • Ends{" "}
                {new Date(c.endDate).toLocaleDateString()}
              </p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
