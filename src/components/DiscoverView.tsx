"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MOCK_RECOMMENDATIONS } from "@/data/recommendations";
import { ToolCard } from "@/components/ToolCard";
import { TaskInput } from "@/components/TaskInput";
import Link from "next/link";

type SortOption = "recommended" | "a-z" | "z-a";

export function DiscoverView() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL params
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(searchParams.get("category"));
  const [selectedPricing, setSelectedPricing] = useState<string | null>(searchParams.get("pricing"));
  const [sortBy, setSortBy] = useState<SortOption>((searchParams.get("sort") as SortOption) || "recommended");
  
  const [hasTask, setHasTask] = useState(false);
  
  // Compare functionality state
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

  // Extract unique categories from the data
  const categories = useMemo(() => {
    const allCategories = MOCK_RECOMMENDATIONS.map(tool => tool.category);
    return Array.from(new Set(allCategories)).sort();
  }, []);

  // Extract unique pricing options from the data
  const pricingOptions = useMemo(() => {
    const allPricing = MOCK_RECOMMENDATIONS.map(tool => tool.pricing).filter(Boolean) as string[];
    return Array.from(new Set(allPricing)).sort();
  }, []);

  // Filter and sort the tools
  const filteredAndSortedTools = useMemo(() => {
    let result = [...MOCK_RECOMMENDATIONS];

    // Apply Search
    if (searchQuery.trim() !== "") {
      const normalizedQuery = searchQuery.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, ' ').trim();
      const stopWords = new Set(['i', 'want', 'to', 'create', 'a', 'for', 'my', 'the', 'an', 'need', 'make', 'do', 'help', 'with', 'some']);
      const keywords = normalizedQuery.split(' ').filter(word => !stopWords.has(word) && word.length > 1);

      if (normalizedQuery.length > 0) {
        // Map tools to their scores
        const scoredTools = result.map(tool => {
          let score = 0;
          const toolName = tool.name.toLowerCase();
          const toolCategory = tool.category.toLowerCase();
          const toolDescription = tool.description.toLowerCase();
          const toolBestFor = tool.bestFor?.toLowerCase() || '';

          // Exact or strong name match
          if (toolName === normalizedQuery) score += 100;
          else if (toolName.includes(normalizedQuery)) score += 50;

          // Strong category/bestFor match
          if (toolCategory === normalizedQuery) score += 40;
          else if (toolCategory.includes(normalizedQuery)) score += 20;

          if (toolBestFor.includes(normalizedQuery)) score += 15;

          // Keyword matching
          if (keywords.length > 0) {
            keywords.forEach(kw => {
              if (toolName.includes(kw)) score += 10;
              if (toolCategory.includes(kw)) score += 5;
              if (toolBestFor.includes(kw)) score += 5;
              if (tool.features?.some(f => f.toLowerCase().includes(kw))) score += 3;
              if (toolDescription.includes(kw)) score += 1;
            });
          }

          return { tool, score };
        });

        // Filter out zero-score tools and unwrap
        result = scoredTools
          .filter(item => item.score > 0)
          .sort((a, b) => b.score - a.score)
          .map(item => item.tool);
      }
    }

    // Apply Category Filter
    if (selectedCategory) {
      result = result.filter(tool => tool.category === selectedCategory);
    }

    // Apply Pricing Filter
    if (selectedPricing) {
      result = result.filter(tool => tool.pricing === selectedPricing);
    }

    // Apply Sorting (if not searching or if explicitly overridden)
    // When there's a search query, and sortBy is "recommended", we keep the search relevance score order above.
    if (searchQuery.trim() === "" || sortBy !== "recommended") {
      switch (sortBy) {
        case "a-z":
          result.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "z-a":
          result.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case "recommended":
        default:
          // Keep default mock data order if no search
          break;
      }
    }

    return result;
  }, [searchQuery, selectedCategory, selectedPricing, sortBy]);

  const hasFilters = searchQuery.trim() !== "" || selectedCategory !== null || selectedPricing !== null;

  // Sync state to URL
  useEffect(() => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    
    if (searchQuery.trim()) {
      params.set("q", searchQuery.trim());
    } else {
      params.delete("q");
    }

    if (selectedCategory) {
      params.set("category", selectedCategory);
    } else {
      params.delete("category");
    }

    if (selectedPricing) {
      params.set("pricing", selectedPricing);
    } else {
      params.delete("pricing");
    }

    if (sortBy !== "recommended") {
      params.set("sort", sortBy);
    } else {
      params.delete("sort");
    }

    const newQuery = params.toString();
    const newUrl = newQuery ? `/discover?${newQuery}` : "/discover";
    router.replace(newUrl, { scroll: false });
  }, [searchQuery, selectedCategory, selectedPricing, sortBy, router, searchParams]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    setSelectedPricing(null);
    setSortBy("recommended");
  };

  return (
    <div className="flex flex-col gap-8 w-full pb-24">
      {/* Header & Search */}
      <div className="flex flex-col gap-6 items-center">
        <div className="w-full max-w-4xl mx-auto">
          <TaskInput 
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            onTaskResolved={(ctx) => setHasTask(!!ctx)} 
          />
        </div>
      </div>

      {!hasTask && (
        <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters & Sort */}
        <div className="w-full lg:w-64 flex-shrink-0 flex flex-col gap-6">
          
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Sort By</h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-brand-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              aria-label="Sort tools"
            >
              <option value="recommended">Recommended</option>
              <option value="a-z">Name (A–Z)</option>
              <option value="z-a">Name (Z–A)</option>
            </select>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Category</h3>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === null 
                    ? "bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400" 
                    : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-zinc-800"
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === cat 
                      ? "bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400" 
                      : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-zinc-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {pricingOptions.length > 0 && (
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Pricing</h3>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setSelectedPricing(null)}
                  className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedPricing === null 
                      ? "bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400" 
                      : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-zinc-800"
                  }`}
                >
                  All Pricing
                </button>
                {pricingOptions.map((price) => (
                  <button
                    key={price}
                    onClick={() => setSelectedPricing(price)}
                    className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedPricing === price 
                        ? "bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400" 
                        : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-zinc-800"
                    }`}
                  >
                    {price}
                  </button>
                ))}
              </div>
            </div>
          )}

          {hasFilters && (
            <button
              onClick={handleClearFilters}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
            >
              Clear Filters
            </button>
          )}

        </div>

        {/* Main Grid */}
        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>Showing {filteredAndSortedTools.length} tool{filteredAndSortedTools.length !== 1 && 's'}</span>
          </div>

          {filteredAndSortedTools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredAndSortedTools.map(tool => (
                <ToolCard 
                  key={tool.id} 
                  tool={tool} 
                  isSelected={selectedTools.includes(tool.slug)}
                  onToggleCompare={() => handleToggleCompare(tool.slug)}
                  disabledCompare={selectedTools.length >= 3 && !selectedTools.includes(tool.slug)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center border border-gray-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm animate-in fade-in">
              <svg className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No AI tools found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
                Try a different search or explore our categories.
              </p>
              <button
                onClick={handleClearFilters}
                className="rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </div>
      )}

      {/* Compare Floating Action Bar */}
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
