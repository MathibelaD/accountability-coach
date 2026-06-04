import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, role } = session.user;
  const challenges =
    role === "coach"
      ? await prisma.challenge.findMany({
          where: { coachId: id },
          include: { members: true, tasks: true },
          orderBy: { createdAt: "desc" },
        })
      : await prisma.challenge.findMany({
          where: { members: { some: { userId: id } } },
          include: { tasks: true, members: true },
          orderBy: { createdAt: "desc" },
        });

  return NextResponse.json(challenges);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "coach") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, description, startDate, endDate, tasks, imageUrl } = await req.json();
  const challenge = await prisma.challenge.create({
    data: {
      coachId: session.user.id,
      title,
      description,
      imageUrl,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      tasks: { create: (tasks || []).map((name: string) => ({ name })) },
    },
    include: { tasks: true },
  });

  return NextResponse.json(challenge);
}
