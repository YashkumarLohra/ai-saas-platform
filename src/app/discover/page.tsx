import { DiscoverView } from "@/components/DiscoverView";
import Link from "next/link";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Discover AI Tools | Platform",
  description: "Browse, filter, and search our curated directory of AI tools.",
};

export default function DiscoverPage() {
  return (
    <div className="flex min-h-screen flex-col p-6 sm:p-12 md:p-20 bg-gray-50 dark:bg-zinc-950">
      <main className="w-full max-w-7xl mx-auto flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <nav className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-brand-600 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 rounded px-1 -ml-1">
              Home
            </Link>
            <svg className="mx-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 dark:text-gray-100 font-semibold" aria-current="page">Discover</span>
          </nav>
          
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
            Explore AI Tools
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Browse our directory of premium AI tools.
          </p>
        </div>
        
        <Suspense fallback={<div className="w-full flex justify-center p-12 text-gray-500">Loading directory...</div>}>
          <DiscoverView />
        </Suspense>
      </main>
    </div>
  );
}
