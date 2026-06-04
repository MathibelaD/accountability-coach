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
    <div className="space-y-6 stagger">
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900">Hey, {session.user.name} 👋</h2>
        <p className="text-gray-500 text-sm mt-1">Here&apos;s how your team is doing today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="stat-card text-center">
          <p className="text-3xl font-extrabold text-[#5f7a6a]">{challenges.length}</p>
          <p className="text-xs text-gray-500 mt-1">Challenges</p>
        </div>
        <div className="stat-card text-center">
          <p className="text-3xl font-extrabold text-[#5f7a6a]">{totalMembers}</p>
          <p className="text-xs text-gray-500 mt-1">Members</p>
        </div>
        <div className="stat-card text-center">
          <p className="text-3xl font-extrabold text-[#5f7a6a]">{todayCheckins}</p>
          <p className="text-xs text-gray-500 mt-1">Checked In</p>
        </div>
        <div className="stat-card text-center">
          <p className="text-3xl font-extrabold text-[#c45d4a]">{missedToday}</p>
          <p className="text-xs text-gray-500 mt-1">Missed</p>
        </div>
      </div>

      {/* Engagement */}
      <div className="card">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-semibold text-gray-700">Today&apos;s Engagement</span>
          <span className="text-lg font-extrabold text-[#5f7a6a]">{engagement}%</span>
        </div>
        <div className="w-full bg-[#e8ddd0]/50 rounded-full h-3 overflow-hidden">
          <div
            className="progress-bar h-3 rounded-full transition-all duration-500"
            style={{ width: `${engagement}%` }}
          />
        </div>
      </div>

      {/* Challenges List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-800">Your Challenges</h3>
          <Link href="/coach/challenges/new" className="text-sm text-[#5f7a6a] font-medium hover:underline">
            + New
          </Link>
        </div>
        {challenges.length === 0 ? (
          <div className="card text-center py-10">
            <p className="text-4xl mb-3">🌱</p>
            <p className="text-gray-500 font-medium">No challenges yet</p>
            <Link href="/coach/challenges/new" className="btn-primary inline-block mt-4">
              Create Your First Challenge
            </Link>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {challenges.map((c) => (
              <Link key={c.id} href={`/coach/challenges/${c.id}`} className="card block group">
                <h4 className="font-bold text-gray-900 group-hover:text-[#5f7a6a] transition-colors">
                  {c.title}
                </h4>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs bg-[#5f7a6a]/10 text-[#3d5a4a] px-2 py-0.5 rounded-full font-medium">
                    {c.members.length} members
                  </span>
                  <span className="text-xs text-gray-400">
                    Ends {new Date(c.endDate).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
