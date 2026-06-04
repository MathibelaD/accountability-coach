"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [challenges, setChallenges] = useState<{ id: string; title: string }[]>([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    instructions: "",
    challengeIds: [] as string[],
  });

  useEffect(() => {
    fetch("/api/challenges").then((r) => r.json()).then(setChallenges);
  }, []);

  function toggleChallenge(id: string) {
    setForm((f) => ({
      ...f,
      challengeIds: f.challengeIds.includes(id)
        ? f.challengeIds.filter((c) => c !== id)
        : [...f.challengeIds, id],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      const product = await res.json();
      // Link to challenges
      if (form.challengeIds.length > 0) {
        await fetch(`/api/products/${product.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, challengeIds: form.challengeIds }),
        });
      }
      router.push("/coach/products");
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <div className="space-y-5 stagger">
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900">Add Product</h2>
        <p className="text-gray-500 text-sm mt-1">Add a product with usage instructions for your members</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="Product name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="input"
          required
        />
        <textarea
          placeholder="Short description (what is this product?)"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="input min-h-[80px]"
        />
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Usage Instructions</label>
          <textarea
            placeholder="How should members use this product? (dosage, timing, tips...)"
            value={form.instructions}
            onChange={(e) => setForm({ ...form, instructions: e.target.value })}
            className="input min-h-[120px]"
          />
        </div>

        {challenges.length > 0 && (
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Link to Challenges</label>
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
          {loading ? "Saving..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}
