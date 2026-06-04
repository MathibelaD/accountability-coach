import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { ProductEditForm } from "./ProductEditForm";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || session.user.role !== "coach") redirect("/member");

  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id, coachId: session.user.id },
    include: { challenges: true },
  });

  if (!product) notFound();

  const challenges = await prisma.challenge.findMany({
    where: { coachId: session.user.id },
    select: { id: true, title: true },
  });

  return (
    <ProductEditForm
      product={product}
      linkedChallengeIds={product.challenges.map((c) => c.challengeId)}
      challenges={challenges}
    />
  );
}
