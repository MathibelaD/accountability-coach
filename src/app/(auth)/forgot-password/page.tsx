"use client";
import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // In MVP, just show confirmation. Full email reset to be implemented with email service.
    setSent(true);
  }

  return (
    <main className="min-h-dvh flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
          <p className="text-gray-500 mt-1">We&apos;ll send you a reset link</p>
        </div>
        {sent ? (
          <div className="card text-center">
            <p className="text-green-600 font-medium">✓ Reset link sent to {email}</p>
            <Link href="/login" className="text-indigo-500 text-sm mt-4 block">
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
            <Link href="/login" className="text-sm text-indigo-500 block text-center">
              Back to login
            </Link>
          </form>
        )}
      </div>
    </main>
  );
}
