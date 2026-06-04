"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "member" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Registration failed");
      setLoading(false);
      return;
    }

    await signIn("credentials", { email: form.email, password: form.password, redirect: false });
    router.push("/");
    router.refresh();
  }

  return (
    <main className="min-h-dvh flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-500 mt-1">Start your accountability journey</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">{error}</div>
          )}
          <input
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="input"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="input"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="input"
            required
            minLength={6}
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setForm({ ...form, role: "member" })}
              className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                form.role === "member" ? "bg-indigo-500 text-white" : "bg-gray-100 text-gray-600"
              }`}
            >
              👤 Member
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, role: "coach" })}
              className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                form.role === "coach" ? "bg-indigo-500 text-white" : "bg-gray-100 text-gray-600"
              }`}
            >
              🏋️ Coach
            </button>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>
        <p className="text-sm text-gray-500 text-center mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-500 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
