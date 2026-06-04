import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "coach") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { challengeId, message, type } = await req.json();
  const announcement = await prisma.announcement.create({
    data: { challengeId, message, type: type || "announcement" },
  });
  return NextResponse.json(announcement);
}

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const challengeId = req.nextUrl.searchParams.get("challengeId");
  if (!challengeId) return NextResponse.json({ error: "challengeId required" }, { status: 400 });

  const announcements = await prisma.announcement.findMany({
    where: { challengeId },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(announcements);
}
