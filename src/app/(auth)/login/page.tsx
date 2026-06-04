"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <main className="auth-bg min-h-dvh flex flex-col items-center justify-center p-6">
      <div className="relative z-10 w-full max-w-sm animate-fade-up">
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-[#5f7a6a] rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-xl">🌿</span>
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900">Welcome Back</h1>
            <p className="text-gray-500 mt-1 text-sm">Sign in to continue your journey</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              required
            />
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          <div className="mt-5 text-center space-y-2">
            <Link href="/forgot-password" className="text-sm text-[#5f7a6a] font-medium">
              Forgot password?
            </Link>
            <p className="text-sm text-gray-500">
              No account?{" "}
              <Link href="/register" className="text-[#5f7a6a] font-semibold">
                Sign up
              </Link>
            </p>
          </div>

          {/* Demo credentials */}
          <div className="mt-6 border-t border-[#e8ddd0]/60 pt-4">
            <p className="text-xs text-gray-400 text-center mb-2">Demo Accounts</p>
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => { setEmail("coach@demo.com"); setPassword("coach123"); }}
                className="w-full text-left px-3 py-2 rounded-lg bg-[#f9f6f2] text-xs text-gray-600 hover:bg-[#e8ddd0]/50 transition-all"
              >
                <span className="font-semibold text-[#5f7a6a]">Coach</span> — coach@demo.com / coach123
              </button>
              <button
                type="button"
                onClick={() => { setEmail("member@demo.com"); setPassword("member123"); }}
                className="w-full text-left px-3 py-2 rounded-lg bg-[#f9f6f2] text-xs text-gray-600 hover:bg-[#e8ddd0]/50 transition-all"
              >
                <span className="font-semibold text-[#5f7a6a]">Member</span> — member@demo.com / member123
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
