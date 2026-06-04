import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || session.user.role !== "coach") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { name, description, instructions, imageUrl, challengeIds } = await req.json();

  const product = await prisma.product.update({
    where: { id, coachId: session.user.id },
    data: { name, description, instructions, imageUrl },
  });

  // Sync challenge links if provided
  if (challengeIds !== undefined) {
    await prisma.challengeProduct.deleteMany({ where: { productId: id } });
    if (challengeIds.length > 0) {
      await prisma.challengeProduct.createMany({
        data: challengeIds.map((challengeId: string) => ({ challengeId, productId: id })),
      });
    }
  }

  return NextResponse.json(product);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || session.user.role !== "coach") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.product.delete({ where: { id, coachId: session.user.id } });
  return NextResponse.json({ ok: true });
}
