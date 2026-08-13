import { Suspense } from "react";
import Link from "next/link";
import { CompareClientView } from "@/components/CompareClientView";

export const metadata = {
  title: "Compare AI Tools | Platform",
  description: "Compare AI tools side-by-side to find the best fit for your needs.",
};

export default function ComparePage() {
  return (
    <div className="flex min-h-screen flex-col p-6 sm:p-12 md:p-20 bg-gray-50 dark:bg-zinc-950">
      <main className="w-full max-w-7xl mx-auto flex flex-col gap-8">
        
        {/* Breadcrumbs / Header */}
        <div className="flex flex-col gap-4">
          <nav className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400" aria-label="Breadcrumb">
            <Link href="/discover" className="hover:text-brand-600 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 rounded px-1 -ml-1">
              Discover
            </Link>
            <svg className="mx-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 dark:text-gray-100 font-semibold" aria-current="page">Compare Tools</span>
          </nav>
          
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
            Tool Comparison
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Compare features, pricing, and capabilities side-by-side.
          </p>
        </div>

        <Suspense fallback={
          <div className="flex justify-center p-12">
            <div className="animate-pulse flex flex-col items-center gap-4">
              <div className="h-12 w-12 bg-gray-200 dark:bg-zinc-800 rounded-full"></div>
              <div className="h-4 w-32 bg-gray-200 dark:bg-zinc-800 rounded"></div>
            </div>
          </div>
        }>
          <CompareClientView />
        </Suspense>
        
      </main>
    </div>
  );
}
