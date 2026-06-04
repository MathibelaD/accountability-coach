import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function CoachProductsPage() {
  const session = await auth();
  if (!session || session.user.role !== "coach") redirect("/member");

  const products = await prisma.product.findMany({
    where: { coachId: session.user.id },
    include: { challenges: { include: { challenge: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-5 stagger">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">Products</h2>
          <p className="text-gray-500 text-sm mt-1">Manage your products & usage instructions</p>
        </div>
        <Link href="/coach/products/new" className="btn-primary text-sm">
          + Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="card text-center py-10">
          <p className="text-4xl mb-3">📦</p>
          <p className="text-gray-500 font-medium">No products yet</p>
          <p className="text-sm text-gray-400 mt-1">Add products so members know how to use them</p>
          <Link href="/coach/products/new" className="btn-primary inline-block mt-4">
            Add Your First Product
          </Link>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {products.map((product) => (
            <Link key={product.id} href={`/coach/products/${product.id}`} className="card block group">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-[#c4a882]/15 rounded-xl flex items-center justify-center shrink-0">
                  <span className="text-xl">📦</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 group-hover:text-[#5f7a6a] transition-colors truncate">
                    {product.name}
                  </h3>
                  {product.description && (
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{product.description}</p>
                  )}
                  {product.challenges.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {product.challenges.map((cp) => (
                        <span key={cp.id} className="text-[10px] bg-[#5f7a6a]/10 text-[#3d5a4a] px-2 py-0.5 rounded-full">
                          {cp.challenge.title}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
