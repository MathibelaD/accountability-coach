import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Home() {
  const session = await auth();
  if (session) {
    redirect(session.user.role === "coach" ? "/coach" : "/member");
  }

  return (
    <main className="min-h-dvh flex flex-col items-center justify-center p-6 text-center">
      <div className="mb-8">
        <div className="w-20 h-20 bg-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">🎯</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">AccountaBuddy</h1>
        <p className="text-gray-500 mt-2">Stay accountable. Stay consistent. See results.</p>
      </div>
      <div className="w-full max-w-sm space-y-3">
        <Link href="/login" className="btn-primary block text-center w-full">
          Sign In
        </Link>
        <Link href="/register" className="btn-secondary block text-center w-full">
          Create Account
        </Link>
      </div>
    </main>
  );
}
