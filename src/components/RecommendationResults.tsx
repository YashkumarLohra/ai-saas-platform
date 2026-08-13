import { ToolCard } from "@/components/ToolCard";
import { MOCK_RECOMMENDATIONS } from "@/data/recommendations";

interface RecommendationResultsProps {
  submittedTask: string;
}

export function RecommendationResults({ submittedTask }: RecommendationResultsProps) {
  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500 mt-4">
      <div className="flex flex-col items-center text-center mb-12">
        {/* Task Context Area */}
        <div className="flex flex-col items-center mb-8">
          <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Your Task
          </span>
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl py-4 px-6 shadow-sm max-w-2xl">
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              &quot;{submittedTask}&quot;
            </p>
          </div>
        </div>

        {/* Arrow / Divider */}
        <div className="h-8 w-px bg-gray-200 dark:bg-zinc-800 mb-8 relative">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 rounded-full bg-brand-500 ring-4 ring-white dark:ring-zinc-950"></div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
          Recommended for your task
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl text-balance">
          We&apos;ve found the best AI tools suited to help you accomplish this.
        </p>
        <div className="mt-4 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-500">
          Demo Data Mode: Showing static recommendations for milestone validation.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full text-left">
        {MOCK_RECOMMENDATIONS.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
}
