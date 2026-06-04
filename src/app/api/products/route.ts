import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const where = session.user.role === "coach"
    ? { coachId: session.user.id }
    : { challenges: { some: { challenge: { members: { some: { userId: session.user.id } } } } } };

  const products = await prisma.product.findMany({
    where,
    include: { challenges: { include: { challenge: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "coach") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, description, instructions, imageUrl } = await req.json();
  if (!name?.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const product = await prisma.product.create({
    data: { name, description, instructions, imageUrl, coachId: session.user.id },
  });

  return NextResponse.json(product, { status: 201 });
}
