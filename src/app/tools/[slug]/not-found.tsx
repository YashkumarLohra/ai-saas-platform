import Link from "next/link";

export default function ToolNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
      <div className="flex flex-col items-center gap-6 max-w-md">
        <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-zinc-900 flex items-center justify-center border border-gray-200 dark:border-zinc-800">
          <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Tool not found
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            We couldn&apos;t find the AI tool you&apos;re looking for.
          </p>
        </div>

        <Link 
          href="/discover" 
          className="mt-4 rounded-xl bg-brand-600 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 shadow-sm"
        >
          Explore AI Tools
        </Link>
      </div>
    </div>
  );
}
