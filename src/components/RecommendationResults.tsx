"use client";

import { useState } from "react";
import { ToolCard } from "@/components/ToolCard";
import { MOCK_RECOMMENDATIONS } from "@/data/recommendations";
import { TaskContext } from "@/types/index";
import Link from "next/link";

interface RecommendationResultsProps {
  context: TaskContext;
  onEditTask: () => void;
}

export function RecommendationResults({ context, onEditTask }: RecommendationResultsProps) {
  const [selectedTools, setSelectedTools] = useState<string[]>([]);

  const handleToggleCompare = (slug: string) => {
    setSelectedTools(prev => {
      if (prev.includes(slug)) {
        return prev.filter(s => s !== slug);
      }
      if (prev.length < 3) {
        return [...prev, slug];
      }
      return prev;
    });
  };

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500 mt-4 relative pb-24">
      <div className="flex flex-col items-center text-center mb-12">
        {/* Task Context Area */}
        <div className="flex flex-col items-center mb-8">
          <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Your Task
          </span>
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl py-4 px-6 shadow-sm max-w-2xl mb-4">
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              &quot;{context.query}&quot;
            </p>
          </div>
          <button 
            onClick={onEditTask}
            className="text-sm font-medium text-brand-600 hover:text-brand-500 transition-colors flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 rounded px-2 py-1"
            aria-label="Edit your task"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Edit Task
          </button>
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
          <ToolCard 
            key={tool.id} 
            tool={tool}
            isRecommended={true}
            isSelected={selectedTools.includes(tool.slug)}
            onToggleCompare={() => handleToggleCompare(tool.slug)}
            disabledCompare={selectedTools.length >= 3 && !selectedTools.includes(tool.slug)}
          />
        ))}
      </div>

      {selectedTools.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-10 fade-in duration-300">
          <div className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-xl rounded-full p-2 pl-6 flex items-center gap-4 border border-gray-800 dark:border-gray-200">
            <span className="font-medium text-sm whitespace-nowrap">
              {selectedTools.length} {selectedTools.length === 1 ? "tool" : "tools"} selected
            </span>
            <Link
              href={`/compare?tools=${selectedTools.join(",")}`}
              aria-disabled={selectedTools.length < 2}
              className={`rounded-full px-5 py-2 text-sm font-bold transition-all whitespace-nowrap ${
                selectedTools.length >= 2 
                  ? "bg-brand-500 text-white hover:bg-brand-400 shadow-md" 
                  : "bg-gray-800 text-gray-500 dark:bg-gray-100 dark:text-gray-400 pointer-events-none"
              }`}
            >
              Compare tools
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
