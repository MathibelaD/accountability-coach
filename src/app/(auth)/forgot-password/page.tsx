"use client";
import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <main className="auth-bg min-h-dvh flex flex-col items-center justify-center p-6">
      <div className="relative z-10 w-full max-w-sm animate-fade-up">
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-extrabold text-gray-900">Reset Password</h1>
            <p className="text-gray-500 mt-1 text-sm">We&apos;ll send you a reset link</p>
          </div>
          {sent ? (
            <div className="text-center py-4">
              <p className="text-[#5f7a6a] font-semibold">✓ Reset link sent to {email}</p>
              <Link href="/login" className="text-[#5f7a6a] text-sm mt-4 block font-medium">
                Back to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                required
              />
              <button type="submit" className="btn-primary w-full">
                Send Reset Link
              </button>
              <Link href="/login" className="text-sm text-[#5f7a6a] block text-center font-medium">
                Back to login
              </Link>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
