import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { SendMessageButton } from "@/components/SendMessageButton";

export default async function ChallengeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || session.user.role !== "coach") redirect("/member");

  const { id } = await params;
  const challenge = await prisma.challenge.findUnique({
    where: { id },
    include: {
      tasks: true,
      members: { include: { user: { select: { id: true, name: true, email: true } } } },
      checkins: { include: { completions: true } },
    },
  });

  if (!challenge) redirect("/coach");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const membersWithStats = challenge.members.map((m) => {
    const memberCheckins = challenge.checkins.filter((c) => c.userId === m.userId);
    const checkedInToday = memberCheckins.some((c) => new Date(c.date) >= today);
    // Calculate streak
    let streak = 0;
    const sorted = memberCheckins.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    for (const ch of sorted) {
      const d = new Date(ch.date);
      const expected = new Date(today);
      expected.setDate(expected.getDate() - streak);
      expected.setHours(0, 0, 0, 0);
      if (d.getTime() === expected.getTime()) {
        streak++;
      } else break;
    }
    return { ...m, checkedInToday, streak, totalCheckins: memberCheckins.length };
  });

  const inviteCode = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/challenges/${id}/join`;

  return (
    <div className="space-y-4">
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900">{challenge.title}</h2>
        {challenge.description && <p className="text-sm text-gray-500 mt-1">{challenge.description}</p>}
        <div className="flex gap-4 mt-3 text-xs text-gray-500">
          <span>📅 {new Date(challenge.startDate).toLocaleDateString()} - {new Date(challenge.endDate).toLocaleDateString()}</span>
          <span>👥 {challenge.members.length} members</span>
        </div>
      </div>

      {/* Invite Link */}
      <div className="card">
        <p className="text-xs text-gray-500 mb-1">Share invite link:</p>
        <code className="text-xs bg-gray-50 p-2 rounded-lg block break-all">{inviteCode}</code>
      </div>

      {/* Tasks */}
      <div className="card">
        <h3 className="font-semibold text-gray-700 mb-2">Daily Tasks</h3>
        <ul className="space-y-1">
          {challenge.tasks.map((t) => (
            <li key={t.id} className="text-sm text-gray-600">• {t.name}</li>
          ))}
        </ul>
      </div>

      {/* Members */}
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-700">Members</h3>
        {membersWithStats.map((m) => (
          <div key={m.id} className="card flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">{m.user.name}</p>
              <p className="text-xs text-gray-500">
                🔥 {m.streak} day streak • {m.totalCheckins} check-ins
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${m.checkedInToday ? "bg-green-400" : "bg-red-400"}`} />
              <SendMessageButton challengeId={id} />
            </div>
          </div>
        ))}
        {challenge.members.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">No members yet. Share the invite link!</p>
        )}
      </div>
    </div>
  );
}
