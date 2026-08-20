"use client";

import { useState, useMemo } from "react";
import { ToolCard } from "@/components/ToolCard";
import { MOCK_RECOMMENDATIONS } from "@/data/recommendations";
import { TaskContext } from "@/types/index";
import Link from "next/link";
import { FeedbackWidget } from "@/components/FeedbackWidget";

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

  const filteredTools = useMemo(() => {
    const q = context.query.toLowerCase().trim();
    if (!q) return MOCK_RECOMMENDATIONS;
    
    // Split query into keywords, removing short/common words
    const stopWords = new Set(['i', 'want', 'to', 'create', 'a', 'for', 'my', 'the', 'an', 'need', 'make', 'do', 'help', 'with', 'some']);
    const keywords = q.split(/\s+/).filter(word => !stopWords.has(word) && word.length > 2);
    
    if (keywords.length === 0) return MOCK_RECOMMENDATIONS;

    return MOCK_RECOMMENDATIONS.filter(tool => {
      const toolText = [
        tool.name,
        tool.description,
        tool.category,
        tool.bestFor,
        ...tool.features,
        ...tool.reasons,
        ...tool.pros,
        ...tool.cons
      ].join(" ").toLowerCase();

      return keywords.some(kw => toolText.includes(kw));
    });
  }, [context.query]);

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500 mt-4 relative pb-24">
      <div className="flex flex-col items-center text-center mb-10">
        {/* Task Context Area */}
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 text-balance max-w-4xl">
            AI tools for &quot;{context.query}&quot;
          </h2>
          {filteredTools.length > 0 && (
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl text-balance mb-6">
              Based on your task, here are the strongest matches to help you get it done.
            </p>
          )}
          <button 
            onClick={onEditTask}
            className="text-sm font-medium text-brand-600 hover:text-brand-500 transition-colors flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 rounded px-3 py-1.5 bg-brand-50 dark:bg-brand-900/20"
            aria-label="Edit your task"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Refine task description
          </button>
        </div>

        {/* Divider line removed for cleaner layout */}
      </div>

      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full text-left">
          {filteredTools.map((tool, idx) => (
            <div key={tool.id} className="flex flex-col gap-3">
              <ToolCard 
                tool={tool}
                isRecommended={true}
                isBestMatch={idx === 0}
                taskQuery={context.query}
                isSelected={selectedTools.includes(tool.slug)}
                onToggleCompare={() => handleToggleCompare(tool.slug)}
                disabledCompare={selectedTools.length >= 3 && !selectedTools.includes(tool.slug)}
              />
              <FeedbackWidget toolId={tool.slug} taskQuery={context.query} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-3xl bg-white/50 dark:bg-zinc-900/50 w-full max-w-3xl mx-auto">
          <svg className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No matching AI tools found</h3>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-6">Try describing your task differently or explore all AI tools.</p>
          <div className="flex gap-4">
            <button
              onClick={onEditTask}
              className="rounded-xl border border-gray-300 bg-white dark:bg-zinc-800 dark:border-zinc-700 px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200 transition-colors hover:bg-gray-50 dark:hover:bg-zinc-700 shadow-sm"
            >
              Try another task
            </button>
            <Link
              href="/discover"
              className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
            >
              Explore Discover
            </Link>
          </div>
        </div>
      )}

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
