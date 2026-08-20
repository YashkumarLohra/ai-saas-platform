"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // We log the error to an error reporting service in production, 
    // but we do not expose it to the user.
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
      <div className="flex flex-col items-center gap-6 max-w-md">
        <div className="w-20 h-20 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center border border-red-100 dark:border-red-900/30">
          <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Something went wrong
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Something unexpected happened. Please try again.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full justify-center">
          <button 
            onClick={() => reset()}
            className="rounded-xl bg-brand-600 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 shadow-sm"
          >
            Try Again
          </button>
          <Link 
            href="/discover" 
            className="rounded-xl border border-gray-200 bg-white px-8 py-4 text-base font-semibold text-gray-900 transition-colors hover:bg-gray-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 shadow-sm"
          >
            Go to Discover
          </Link>
        </div>
      </div>
    </div>
  );
}
