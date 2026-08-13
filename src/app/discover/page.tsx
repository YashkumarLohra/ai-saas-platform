import { DiscoverView } from "@/components/DiscoverView";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Discover AI Tools | Platform",
  description: "Browse, filter, and search our curated directory of AI tools.",
};

export default function DiscoverPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <Link 
            href="/"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors mb-6"
          >
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Explore AI Tools
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Browse our directory of premium AI tools.
          </p>
        </div>
        
        <DiscoverView />
      </div>
    </main>
  );
}
