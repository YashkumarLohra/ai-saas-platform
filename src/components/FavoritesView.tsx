"use client";

import { useState, useMemo } from "react";
import { useFavorites } from "@/context/FavoritesContext";
import { MOCK_RECOMMENDATIONS } from "@/data/recommendations";
import { ToolCard } from "@/components/ToolCard";
import Link from "next/link";

export function FavoritesView() {
  const { favorites } = useFavorites();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | "All">("All");

  const savedTools = useMemo(() => {
    return favorites
      .map(slug => MOCK_RECOMMENDATIONS.find(t => t.slug === slug))
      .filter((t): t is NonNullable<typeof t> => t !== undefined);
  }, [favorites]);

  const categories = useMemo(() => {
    const cats = new Set(savedTools.map(t => t.category));
    return ["All", ...Array.from(cats)];
  }, [savedTools]);

  const filteredTools = useMemo(() => {
    return savedTools.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || tool.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [savedTools, searchQuery, selectedCategory]);

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-gray-100 dark:bg-zinc-800 rounded-3xl flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">No saved tools yet</h2>
        <p className="text-lg text-gray-500 dark:text-gray-400 mb-10 max-w-lg leading-relaxed">
          Save AI tools you want to revisit later.
        </p>
        <Link 
          href="/discover"
          className="rounded-xl bg-brand-600 px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 shadow-sm"
        >
          Explore AI Tools
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-300">
      
      {/* Search and Filter Row */}
      <div className="flex flex-col sm:flex-row gap-4 items-center bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm">
        <div className="relative w-full sm:flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="search"
            aria-label="Search saved tools"
            className="block w-full rounded-xl border-0 py-3 pl-11 pr-4 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6 dark:bg-zinc-800 dark:text-white dark:ring-zinc-700 dark:focus:ring-brand-500 transition-all"
            placeholder="Search saved tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {categories.length > 1 && (
          <div className="w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 flex-shrink-0">
            <div className="flex gap-2" role="group" aria-label="Filter by category">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                    selectedCategory === cat
                      ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-700"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTools.map((tool) => (
            <ToolCard 
              key={tool.id} 
              tool={tool} 
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No saved tools found</h3>
          <p className="text-lg text-gray-500 dark:text-gray-400">
            Try a different search.
          </p>
          <button 
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
            }}
            className="mt-4 text-brand-600 dark:text-brand-400 font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-brand-500 rounded px-1 -ml-1"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
