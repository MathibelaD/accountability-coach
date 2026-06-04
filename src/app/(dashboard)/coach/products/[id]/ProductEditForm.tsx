"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  product: { id: string; name: string; description: string | null; instructions: string | null };
  linkedChallengeIds: string[];
  challenges: { id: string; title: string }[];
}

export function ProductEditForm({ product, linkedChallengeIds, challenges }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: product.name,
    description: product.description || "",
    instructions: product.instructions || "",
    challengeIds: linkedChallengeIds,
  });

  function toggleChallenge(id: string) {
    setForm((f) => ({
      ...f,
      challengeIds: f.challengeIds.includes(id)
        ? f.challengeIds.filter((c) => c !== id)
        : [...f.challengeIds, id],
    }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch(`/api/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    router.push("/coach/products");
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/products/${product.id}`, { method: "DELETE" });
    router.push("/coach/products");
    router.refresh();
  }

  return (
    <div className="space-y-5 stagger">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold text-gray-900">Edit Product</h2>
        <button onClick={handleDelete} className="text-sm text-[#c45d4a] font-medium">
          Delete
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <input
          placeholder="Product name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="input"
          required
        />
        <textarea
          placeholder="Short description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="input min-h-[80px]"
        />
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Usage Instructions</label>
          <textarea
            placeholder="How should members use this product?"
            value={form.instructions}
            onChange={(e) => setForm({ ...form, instructions: e.target.value })}
            className="input min-h-[120px]"
          />
        </div>

        {challenges.length > 0 && (
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Linked Challenges</label>
            <div className="space-y-2">
              {challenges.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => toggleChallenge(c.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    form.challengeIds.includes(c.id)
                      ? "bg-[#5f7a6a] text-white"
                      : "bg-[#f4efe9] text-gray-700"
                  }`}
                >
                  {c.title}
                </button>
              ))}
            </div>
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
