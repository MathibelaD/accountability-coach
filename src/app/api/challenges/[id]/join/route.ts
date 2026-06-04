import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const existing = await prisma.challengeMember.findUnique({
    where: { challengeId_userId: { challengeId: id, userId: session.user.id } },
  });
  if (existing) return NextResponse.json({ error: "Already joined" }, { status: 409 });

  const member = await prisma.challengeMember.create({
    data: { challengeId: id, userId: session.user.id },
  });
  return NextResponse.json(member);
}
