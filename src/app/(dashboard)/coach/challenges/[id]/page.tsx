import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { SendMessageButton } from "@/components/SendMessageButton";
import { InviteLink } from "@/components/InviteLink";

export default async function ChallengeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || session.user.role !== "coach") redirect("/member");

  const { id } = await params;
  const challenge = await prisma.challenge.findUnique({
    where: { id },
    include: {
      tasks: true,
      members: { include: { user: { select: { id: true, name: true, email: true } } } },
      checkins: { include: { completions: true, user: { select: { name: true } } } },
      photos: { include: { user: { select: { name: true } } }, orderBy: { uploadedAt: "desc" } },
    },
  });

  if (!challenge) redirect("/coach");

  const members = challenge!.members;
  const checkins = challenge!.checkins;
  const photos = challenge!.photos;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  type Member = (typeof members)[number];
  type Checkin = (typeof checkins)[number];
  type Photo = (typeof photos)[number];

  const membersWithStats = members.map((m: Member) => {
    const memberCheckins: Checkin[] = checkins.filter((c: Checkin) => c.userId === m.userId);
    const checkedInToday = memberCheckins.some((c: Checkin) => new Date(c.date) >= today);
    let streak = 0;
    const sorted = memberCheckins.sort((a: Checkin, b: Checkin) => new Date(b.date).getTime() - new Date(a.date).getTime());
    for (const ch of sorted) {
      const d = new Date(ch.date);
      const expected = new Date(today);
      expected.setDate(expected.getDate() - streak);
      expected.setHours(0, 0, 0, 0);
      if (d.getTime() === expected.getTime()) {
        streak++;
      } else break;
    }

    const latestCheckin = sorted[0];
    const firstCheckin = sorted[sorted.length - 1];
    const weightChange = latestCheckin?.weight && firstCheckin?.weight
      ? (latestCheckin.weight - firstCheckin.weight).toFixed(1)
      : null;

    const memberPhotos: Photo[] = photos.filter((p: Photo) => p.userId === m.userId);

    return { ...m, checkedInToday, streak, totalCheckins: memberCheckins.length, latestCheckin, weightChange, memberPhotos };
  });

  const inviteCode = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/challenges/${id}/join`;

  return (
    <div className="space-y-5 stagger">
      {/* Challenge Header */}
      <div className="card">
        <h2 className="text-xl font-extrabold text-gray-900">{challenge.title}</h2>
        {challenge.description && <p className="text-sm text-gray-500 mt-1">{challenge.description}</p>}
        <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-500">
          <span>📅 {new Date(challenge.startDate).toLocaleDateString()} – {new Date(challenge.endDate).toLocaleDateString()}</span>
          <span>👥 {members.length} members</span>
          <span>📸 {photos.length} photos</span>
        </div>
      </div>

      {/* Invite Link */}
      <InviteLink url={inviteCode} />

      {/* Members Progress */}
      <div className="space-y-3">
        <h3 className="font-bold text-gray-800">Members Progress</h3>
        {membersWithStats.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">No members yet. Share the invite link!</p>
        ) : (
          membersWithStats.map((m) => (
            <div key={m.id} className="card space-y-3">
              {/* Member header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#5f7a6a]/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-[#5f7a6a]">
                      {m.user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{m.user.name}</p>
                    <p className="text-xs text-gray-500">{m.user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${m.checkedInToday ? "bg-[#5f7a6a]" : "bg-[#c45d4a]"}`} />
                  <SendMessageButton challengeId={id} />
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-[#f9f6f2] rounded-xl p-3 text-center">
                  <p className="text-lg font-extrabold text-[#c4a882]">🔥 {m.streak}</p>
                  <p className="text-[10px] text-gray-500">Streak</p>
                </div>
                <div className="bg-[#f9f6f2] rounded-xl p-3 text-center">
                  <p className="text-lg font-extrabold text-[#5f7a6a]">{m.totalCheckins}</p>
                  <p className="text-[10px] text-gray-500">Check-ins</p>
                </div>
                <div className="bg-[#f9f6f2] rounded-xl p-3 text-center">
                  <p className={`text-lg font-extrabold ${m.weightChange && parseFloat(m.weightChange) < 0 ? "text-[#5f7a6a]" : "text-gray-500"}`}>
                    {m.weightChange ? `${parseFloat(m.weightChange) > 0 ? "+" : ""}${m.weightChange}kg` : "—"}
                  </p>
                  <p className="text-[10px] text-gray-500">Weight</p>
                </div>
              </div>

              {/* Latest check-in data */}
              {m.latestCheckin && (
                <div className="bg-[#f9f6f2] rounded-xl p-3 border border-[#e8ddd0]/60">
                  <p className="text-xs font-semibold text-gray-500 mb-1">Latest Check-in — {new Date(m.latestCheckin.date).toLocaleDateString()}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-700">
                    {m.latestCheckin.weight && <span>⚖️ {m.latestCheckin.weight}kg</span>}
                    {m.latestCheckin.waistMeasurement && <span>📏 {m.latestCheckin.waistMeasurement}cm</span>}
                    {m.latestCheckin.waterIntake && <span>💧 {m.latestCheckin.waterIntake}L</span>}
                    {m.latestCheckin.notes && <span>📝 {m.latestCheckin.notes}</span>}
                  </div>
                </div>
              )}

              {/* Member photos */}
              {m.memberPhotos.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-2">Progress Photos</p>
                  <div className="grid grid-cols-4 gap-1.5">
                    {m.memberPhotos.slice(0, 4).map((p) => (
                      <div key={p.id} className="relative">
                        <img
                          src={p.imageUrl}
                          alt={p.caption || "Progress"}
                          className="w-full aspect-square object-cover rounded-lg"
                        />
                        <span className="absolute bottom-0.5 left-0.5 text-[9px] bg-black/50 text-white px-1 rounded capitalize">
                          {p.type}
                        </span>
                      </div>
                    ))}
                    {m.memberPhotos.length > 4 && (
                      <div className="w-full aspect-square bg-[#e8ddd0]/50 rounded-lg flex items-center justify-center">
                        <span className="text-xs text-gray-500 font-medium">+{m.memberPhotos.length - 4}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
