import { TaskInput } from "@/components/TaskInput";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 text-center sm:p-20">
      <main className="flex w-full max-w-5xl flex-col items-center gap-8">
        
        {/* Placeholder Header */}
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-full bg-brand-100 px-3 py-1 text-sm font-medium text-brand-600 dark:bg-brand-900/30 dark:text-brand-500">
            Platform Initialized
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-balance">
            Discover the right AI for any task.
          </h1>
          <p className="max-w-xl text-lg text-gray-600 dark:text-gray-400">
            Describe what you need to accomplish, and we&apos;ll recommend the best AI tools for the job.
          </p>
        </div>

        <TaskInput />

        <div className="mt-2 text-center animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300 fill-mode-both">
          <Link 
            href="/discover"
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-400 transition-colors"
          >
            Or browse all AI tools
            <span className="transition-transform group-hover:translate-x-0.5">&rarr;</span>
          </Link>
        </div>

      </main>
    </div>
  );
}
