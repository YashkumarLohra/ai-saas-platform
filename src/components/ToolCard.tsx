import { Recommendation } from "@/types/index";
import Link from "next/link";

interface ToolCardProps {
  tool: Recommendation;
  isSelected?: boolean;
  onToggleCompare?: () => void;
  disabledCompare?: boolean;
}

export function ToolCard({ tool, isSelected, onToggleCompare, disabledCompare }: ToolCardProps) {
  return (
    <div className={`flex flex-col h-full rounded-2xl border bg-white p-6 shadow-sm dark:bg-zinc-900 transition-all hover:shadow-md relative ${
      isSelected ? 'border-brand-500 ring-1 ring-brand-500 dark:border-brand-400 dark:ring-brand-400' : 'border-gray-200 dark:border-zinc-800'
    }`}>
      {isSelected && (
        <div className="absolute -top-3 -right-3 h-8 w-8 bg-brand-500 text-white rounded-full flex items-center justify-center shadow-md border-2 border-white dark:border-zinc-950 z-10">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="inline-flex items-center rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-600 dark:bg-brand-900/30 dark:text-brand-400 mb-3">
            Top Match
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {tool.name}
          </h3>
          <p className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">
            {tool.category} • {tool.pricing}
          </p>
        </div>
      </div>
      
      <p className="text-gray-600 dark:text-gray-300 mb-6 flex-grow">
        {tool.description}
      </p>

      <div className="mb-6 rounded-xl bg-gray-50 dark:bg-zinc-800/50 p-4 border border-gray-100 dark:border-zinc-800/80">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
          Best for
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {tool.bestFor}
        </p>
      </div>

      <div className="mb-6 rounded-xl bg-gray-50 dark:bg-zinc-800/50 p-4">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          Why we recommend it
        </h4>
        <ul className="space-y-2">
          {tool.reasons.map((reason: string, idx: number) => (
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
        <Link 
          href={`/tools/${tool.slug}`}
          className="flex-1 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-500 text-center flex items-center justify-center"
        >
          View Tool
        </Link>
        <button 
          onClick={onToggleCompare}
          disabled={disabledCompare && !isSelected}
          className={`flex-1 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors text-center flex items-center justify-center gap-2 ${
            isSelected 
              ? "bg-brand-50 border-brand-200 text-brand-700 hover:bg-brand-100 dark:bg-brand-900/30 dark:border-brand-800 dark:text-brand-300 dark:hover:bg-brand-900/50" 
              : "bg-white border-gray-200 text-gray-900 hover:bg-gray-50 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
          }`}
        >
          {isSelected ? (
            <>Remove</>
          ) : (
            <>Compare</>
          )}
        </button>
      </div>
    </div>
  );
}
