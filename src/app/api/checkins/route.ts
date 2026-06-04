import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { challengeId, notes, weight, waistMeasurement, waterIntake, tasks } = await req.json();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const checkin = await prisma.dailyCheckin.upsert({
    where: {
      userId_challengeId_date: { userId: session.user.id, challengeId, date: today },
    },
    update: { notes, weight, waistMeasurement, waterIntake },
    create: {
      userId: session.user.id,
      challengeId,
      date: today,
      notes,
      weight,
      waistMeasurement,
      waterIntake,
    },
  });

  if (tasks && tasks.length > 0) {
    for (const t of tasks) {
      await prisma.taskCompletion.upsert({
        where: { checkinId_taskId: { checkinId: checkin.id, taskId: t.taskId } },
        update: { completed: t.completed },
        create: { checkinId: checkin.id, taskId: t.taskId, completed: t.completed },
      });
    }
  }

  return NextResponse.json(checkin);
}

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const challengeId = req.nextUrl.searchParams.get("challengeId");
  const userId = req.nextUrl.searchParams.get("userId") || session.user.id;

  const checkins = await prisma.dailyCheckin.findMany({
    where: { userId, ...(challengeId ? { challengeId } : {}) },
    include: { completions: true },
    orderBy: { date: "desc" },
  });

  return NextResponse.json(checkins);
}
