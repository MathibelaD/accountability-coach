import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const challenge = await prisma.challenge.findUnique({
    where: { id },
    include: {
      tasks: true,
      members: { include: { user: { select: { id: true, name: true, email: true } } } },
      checkins: { include: { completions: true } },
    },
  });

  if (!challenge) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(challenge);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || session.user.role !== "coach") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  await prisma.challenge.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
