import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function MemberProductsPage() {
  const session = await auth();
  if (!session || session.user.role !== "member") redirect("/coach");

  // Get products linked to challenges the member is part of
  const products = await prisma.product.findMany({
    where: {
      challenges: {
        some: {
          challenge: { members: { some: { userId: session.user.id } } },
        },
      },
    },
    include: { challenges: { include: { challenge: true } } },
  });

  return (
    <div className="space-y-5 stagger">
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900">My Products</h2>
        <p className="text-gray-500 text-sm mt-1">Products & usage instructions from your coach</p>
      </div>

      {products.length === 0 ? (
        <div className="card text-center py-10">
          <p className="text-4xl mb-3">📦</p>
          <p className="text-gray-500 font-medium">No products yet</p>
          <p className="text-sm text-gray-400 mt-1">Your coach will add products when they&apos;re ready</p>
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <div key={product.id} className="card">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-11 h-11 bg-[#c4a882]/15 rounded-xl flex items-center justify-center shrink-0">
                  <span className="text-lg">📦</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{product.name}</h3>
                  {product.description && (
                    <p className="text-sm text-gray-500 mt-0.5">{product.description}</p>
                  )}
                </div>
              </div>
              {product.instructions && (
                <div className="bg-[#f9f6f2] rounded-xl p-4 border border-[#e8ddd0]/60">
                  <p className="text-xs font-semibold text-[#5f7a6a] mb-1.5">How to use</p>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{product.instructions}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
