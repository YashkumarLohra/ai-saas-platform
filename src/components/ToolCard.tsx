"use client";

import { Recommendation } from "@/types/index";
import Link from "next/link";
import { useFavorites } from "@/context/FavoritesContext";

interface ToolCardProps {
  tool: Recommendation;
  isSelected?: boolean;
  onToggleCompare?: () => void;
  disabledCompare?: boolean;
  isRecommended?: boolean;
  isBestMatch?: boolean;
  taskQuery?: string;
  onRemoveFromProject?: () => void;
}

export function ToolCard({ tool, isSelected, onToggleCompare, disabledCompare, isRecommended, isBestMatch, taskQuery, onRemoveFromProject }: ToolCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const saved = isFavorite(tool.slug);

  return (
    <div className={`flex flex-col h-full rounded-2xl border bg-white p-6 shadow-sm dark:bg-zinc-900 transition-all hover:shadow-md relative group ${
      isSelected ? 'border-brand-500 ring-1 ring-brand-500 dark:border-brand-400 dark:ring-brand-400' : 
      isBestMatch ? 'border-amber-400 ring-1 ring-amber-400 dark:border-amber-500 dark:ring-amber-500' : 'border-gray-200 dark:border-zinc-800'
    }`}>
      {isSelected && (
        <div className="absolute -top-3 -right-3 h-8 w-8 bg-brand-500 text-white rounded-full flex items-center justify-center shadow-md border-2 border-white dark:border-zinc-950 z-10">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
      
      <button
        onClick={() => toggleFavorite(tool.slug)}
        className="absolute top-4 right-4 p-2 rounded-full bg-white dark:bg-zinc-900 shadow-sm border border-gray-100 dark:border-zinc-800 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 z-10 opacity-0 group-hover:opacity-100 focus:opacity-100 sm:opacity-100"
        aria-label={saved ? `Remove ${tool.name} from favorites` : `Save ${tool.name}`}
        title={saved ? "Saved" : "Save"}
      >
        <svg 
          className="h-5 w-5" 
          fill={saved ? "currentColor" : "none"} 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={saved ? 0 : 2} 
            d={saved 
              ? "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
              : "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"} 
          />
        </svg>
      </button>

      <div className="flex items-start justify-between gap-4 mb-4 pr-10">
        <div>
          <div className="flex flex-wrap gap-2 mb-3">
            {isBestMatch && (
              <div className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800 dark:bg-amber-900/40 dark:text-amber-400 shadow-sm border border-amber-200 dark:border-amber-800">
                <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Best Match
              </div>
            )}
            {isRecommended && !isBestMatch && (
              <div className="inline-flex items-center rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
                Recommended
              </div>
            )}
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

      <div className="mb-6 rounded-xl bg-gray-50 dark:bg-zinc-800/50 p-4 border border-gray-100 dark:border-zinc-800/80">
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
          href={`/tools/${tool.slug}${taskQuery ? `?task=${encodeURIComponent(taskQuery)}` : ''}`}
          className="flex-1 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-500 text-center flex items-center justify-center"
        >
          View Tool
        </Link>
        {onToggleCompare && (
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
        )}
        {onRemoveFromProject && (
          <button 
            onClick={onRemoveFromProject}
            className="flex-1 rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 dark:border-red-900/30 dark:bg-red-900/10 dark:text-red-400 dark:hover:bg-red-900/30 px-4 py-2.5 text-sm font-semibold transition-colors text-center flex items-center justify-center"
            aria-label={`Remove ${tool.name} from project`}
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
}
