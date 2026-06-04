import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const community = searchParams.get("community") === "true";

  if (community) {
    // Get shared photos from challenges the user is part of
    const photos = await prisma.progressPhoto.findMany({
      where: {
        shared: true,
        challenge: { members: { some: { userId: session.user.id } } },
      },
      include: { user: { select: { name: true } }, challenge: { select: { title: true } } },
      orderBy: { uploadedAt: "desc" },
      take: 50,
    });
    return NextResponse.json(photos);
  }

  // Get own photos
  const photos = await prisma.progressPhoto.findMany({
    where: { userId: session.user.id },
    orderBy: { uploadedAt: "desc" },
  });
  return NextResponse.json(photos);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { imageUrl, challengeId, type, caption, shared } = await req.json();
  if (!imageUrl || !challengeId) {
    return NextResponse.json({ error: "Image and challenge required" }, { status: 400 });
  }

  const photo = await prisma.progressPhoto.create({
    data: {
      imageUrl,
      challengeId,
      type: type || "update",
      caption,
      shared: shared || false,
      userId: session.user.id,
    },
  });

  return NextResponse.json(photo, { status: 201 });
}
