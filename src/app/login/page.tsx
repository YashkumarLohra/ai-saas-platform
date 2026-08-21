"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center p-6 bg-gray-50 dark:bg-zinc-950">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-200 dark:border-zinc-800 text-center animate-in fade-in zoom-in-95 duration-300">
        <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Sign In</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
          Authentication is currently disabled in demo mode. Real authentication will be added in a future milestone.
        </p>
        
        <button 
          onClick={() => router.back()}
          className="w-full rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3.5 text-sm font-semibold transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:ring-offset-2 shadow-sm mb-4"
        >
          Go Back
        </button>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-brand-600 dark:text-brand-400 font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
