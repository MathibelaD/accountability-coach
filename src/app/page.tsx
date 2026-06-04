import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Home() {
  const session = await auth();
  if (session) {
    redirect(session.user.role === "coach" ? "/coach" : "/member");
  }

  return (
    <main className="auth-bg min-h-dvh flex flex-col items-center justify-center p-6 text-center relative">
      <div className="relative z-10 w-full max-w-md animate-fade-up">
        {/* Logo */}
        <div className="mb-10">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-5 glow border border-white/20">
            <span className="text-4xl">🌿</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            AccountaBuddy
          </h1>
          <p className="text-[#c8e0d0] mt-3 text-lg">
            You&apos;re making progress.<br />
            <span className="text-white/90 font-medium">Keep going.</span>
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3">
          <Link
            href="/login"
            className="block w-full py-4 bg-white text-[#3d5a4a] font-bold rounded-xl text-center shadow-xl shadow-black/10 hover:bg-[#f9f6f2] transition-all active:scale-95"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="block w-full py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl text-center border border-white/20 hover:bg-white/20 transition-all active:scale-95"
          >
            Create Account
          </Link>
        </div>

        {/* Social proof */}
        <p className="mt-8 text-[#a8ccb4] text-sm">
          🌱 Building habits that stick, one day at a time
        </p>
      </div>
    </main>
  );
}
