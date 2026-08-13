import { Recommendation } from "@/types";

interface RecommendationCardProps {
  recommendation: Recommendation;
}

export function RecommendationCard({ recommendation }: RecommendationCardProps) {
  return (
    <div className="flex flex-col h-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 transition-all hover:shadow-md">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="inline-flex items-center rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-600 dark:bg-brand-900/30 dark:text-brand-400 mb-3">
            Top Match
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {recommendation.name}
          </h3>
          <p className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">
            {recommendation.pricing} • Best for: {recommendation.bestFor}
          </p>
        </div>
      </div>
      
      <p className="text-gray-600 dark:text-gray-300 mb-6 flex-grow">
        {recommendation.description}
      </p>

      <div className="mb-6 rounded-xl bg-gray-50 dark:bg-zinc-800/50 p-4">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          Why we recommend it
        </h4>
        <ul className="space-y-2">
          {recommendation.reasons.map((reason, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
              <svg className="h-5 w-5 text-brand-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto flex flex-col sm:flex-row gap-3">
        <button className="flex-1 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-500">
          View Tool
        </button>
        <button className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700">
          Compare
        </button>
      </div>
    </div>
  );
}
