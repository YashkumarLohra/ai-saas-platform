import { ToolCard } from "@/components/ToolCard";
import { MOCK_RECOMMENDATIONS } from "@/data/recommendations";

interface RecommendationResultsProps {
  submittedTask: string;
}

export function RecommendationResults({ submittedTask }: RecommendationResultsProps) {
  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500 mt-4">
      <div className="flex flex-col items-center text-center mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
          Recommended for your task
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl text-balance">
          Based on your request: &quot;<span className="font-medium text-gray-900 dark:text-white">{submittedTask}</span>&quot;, we&apos;ve selected tools that may fit your needs.
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
