"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { MOCK_RECOMMENDATIONS } from "@/data/recommendations";
import Link from "next/link";
import { useMemo } from "react";

export function CompareClientView() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const toolsParam = searchParams.get("tools");
  const slugs = useMemo(() => toolsParam ? toolsParam.split(",").filter(Boolean) : [], [toolsParam]);
  
  const tools = useMemo(() => {
    return slugs
      .map(slug => MOCK_RECOMMENDATIONS.find(t => t.slug === slug))
      .filter((t): t is NonNullable<typeof t> => t !== undefined);
  }, [slugs]);

  const removeTool = (slugToRemove: string) => {
    const newSlugs = slugs.filter(s => s !== slugToRemove);
    const newParams = new URLSearchParams(searchParams.toString());
    if (newSlugs.length > 0) {
      newParams.set("tools", newSlugs.join(","));
    } else {
      newParams.delete("tools");
    }
    // Update URL shallowly without reloading the page
    router.replace(`/compare?${newParams.toString()}`, { scroll: false });
  };

  // EMPTY STATE (0 tools)
  if (tools.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-zinc-900 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-sm mt-8 animate-in fade-in duration-500">
        <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mb-6">
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">You haven&apos;t selected any tools to compare yet.</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
          Find tools from our directory and add them to your comparison to see them side-by-side.
        </p>
        <Link 
          href="/discover"
          className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 shadow-sm"
        >
          Discover AI Tools
        </Link>
      </div>
    );
  }

  // MINIMUM STATE (1 tool)
  if (tools.length === 1) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-zinc-900 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-sm mt-8 animate-in fade-in duration-500">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Select at least 2 tools to compare.</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md leading-relaxed">
          You currently have <strong className="text-gray-900 dark:text-gray-200">{tools[0].name}</strong> selected. Add another tool to see a detailed comparison.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button 
            onClick={() => removeTool(tools[0].slug)}
            className="w-full sm:w-auto rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-50 dark:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
          >
            Remove Tool
          </button>
          <Link 
            href="/discover"
            className="w-full sm:w-auto rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 shadow-sm"
          >
            Discover AI Tools
          </Link>
        </div>
      </div>
    );
  }

  // COMPARISON VIEW (2 or more tools)
  return (
    <div className="flex flex-col gap-12 mt-8 animate-in fade-in duration-300">
      
      {/* Desktop/Tablet Table Layout (hidden on strict mobile) */}
      <div className="hidden md:block w-full overflow-x-auto pb-4">
        <table className="w-full min-w-[800px] border-collapse table-fixed">
          <thead>
            <tr>
              <th className="w-48 p-4 align-bottom text-left border-b border-gray-200 dark:border-zinc-800">
                {/* Empty corner - Action to add more if under limit */}
                {tools.length < 3 && (
                  <Link 
                    href="/discover"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 dark:text-brand-400 hover:underline focus:outline-none focus:ring-2 focus:ring-brand-500 rounded-lg px-2 py-1 -ml-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add another tool
                  </Link>
                )}
              </th>
              {tools.map(tool => (
                <th key={tool.id} className="p-4 align-top border-b border-gray-200 dark:border-zinc-800">
                  <div className="flex flex-col items-start text-left gap-4 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm relative group">
                    <button 
                      onClick={() => removeTool(tool.slug)}
                      className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 opacity-0 group-hover:opacity-100 focus:opacity-100"
                      aria-label={`Remove ${tool.name} from comparison`}
                      title="Remove tool"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-100 to-brand-50 dark:from-brand-900/40 dark:to-brand-800/20 flex items-center justify-center border border-brand-200 dark:border-brand-800/50">
                      <span className="text-xl font-bold text-brand-600 dark:text-brand-400" aria-hidden="true">
                        {tool.name.charAt(0)}
                      </span>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{tool.name}</h3>
                      <span className="inline-flex items-center rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
                        {tool.category}
                      </span>
                    </div>

                    <Link 
                      href={`/tools/${tool.slug}`}
                      className="mt-2 text-sm font-semibold text-brand-600 dark:text-brand-400 hover:underline focus:outline-none focus:ring-2 focus:ring-brand-500 rounded px-1 -ml-1"
                    >
                      View Details &rarr;
                    </Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/50">
            {/* Description */}
            <tr>
              <th className="p-4 py-6 text-sm font-semibold text-gray-900 dark:text-white text-left align-top">
                Overview
              </th>
              {tools.map(tool => (
                <td key={tool.id} className="p-4 py-6 align-top">
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{tool.description}</p>
                </td>
              ))}
            </tr>
            {/* Best For */}
            <tr>
              <th className="p-4 py-6 text-sm font-semibold text-gray-900 dark:text-white text-left align-top">
                Best For
              </th>
              {tools.map(tool => (
                <td key={tool.id} className="p-4 py-6 align-top">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-relaxed">{tool.bestFor || "General use"}</p>
                </td>
              ))}
            </tr>
            {/* Pricing */}
            <tr>
              <th className="p-4 py-6 text-sm font-semibold text-gray-900 dark:text-white text-left align-top">
                Pricing
              </th>
              {tools.map(tool => (
                <td key={tool.id} className="p-4 py-6 align-top">
                  <span className="inline-flex items-center rounded-lg bg-gray-100 dark:bg-zinc-800 px-3 py-1.5 text-sm font-medium text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-zinc-700 shadow-sm">
                    {tool.pricing || "Not specified"}
                  </span>
                </td>
              ))}
            </tr>
            {/* Features */}
            <tr>
              <th className="p-4 py-6 text-sm font-semibold text-gray-900 dark:text-white text-left align-top">
                Key Features
              </th>
              {tools.map(tool => (
                <td key={tool.id} className="p-4 py-6 align-top">
                  <ul className="space-y-3">
                    {tool.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <svg className="w-4 h-4 text-brand-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>
            {/* Actions */}
            <tr>
              <th className="p-4 py-8 text-left border-t border-gray-200 dark:border-zinc-800"></th>
              {tools.map(tool => (
                <td key={tool.id} className="p-4 py-8 align-top border-t border-gray-200 dark:border-zinc-800">
                  {tool.websiteUrl ? (
                    <a 
                      href={tool.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex justify-center items-center gap-2 rounded-xl bg-gray-900 dark:bg-white px-4 py-3 text-sm font-semibold text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 shadow-sm"
                    >
                      Visit Website
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  ) : (
                    <button disabled className="w-full flex justify-center items-center gap-2 rounded-xl bg-gray-100 dark:bg-zinc-800 px-4 py-3 text-sm font-semibold text-gray-400 dark:text-gray-500 cursor-not-allowed border border-gray-200 dark:border-zinc-700">
                      Unavailable
                    </button>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Mobile Stack Layout (Hidden on Desktop) */}
      <div className="flex flex-col gap-8 md:hidden">
        {tools.length < 3 && (
          <Link 
            href="/discover"
            className="flex justify-center items-center gap-2 p-4 rounded-2xl border-2 border-dashed border-brand-200 dark:border-brand-900/50 text-brand-600 dark:text-brand-400 bg-brand-50/30 dark:bg-brand-900/5 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors font-medium text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add another tool to compare
          </Link>
        )}

        <div className="flex flex-col gap-6">
          {/* Section: Overview/Headers */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="px-5 py-3 bg-gray-50 dark:bg-zinc-950 border-b border-gray-200 dark:border-zinc-800">
              <h3 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wider">Overview</h3>
            </div>
            <div className="flex flex-col divide-y divide-gray-100 dark:divide-zinc-800/50">
              {tools.map(tool => (
                <div key={tool.id} className="p-5 flex flex-col gap-3 relative">
                  <button 
                    onClick={() => removeTool(tool.slug)}
                    className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 dark:bg-zinc-800 dark:hover:bg-red-900/30 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                    aria-label={`Remove ${tool.name}`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <div className="pr-8">
                    <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-1">{tool.name}</h4>
                    <span className="inline-block text-xs font-semibold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/30 px-2 py-0.5 rounded-full mb-1">
                      {tool.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{tool.description}</p>
                  <Link href={`/tools/${tool.slug}`} className="text-sm font-semibold text-brand-600 dark:text-brand-400 hover:underline inline-flex self-start focus:outline-none focus:ring-2 focus:ring-brand-500 rounded px-1 -ml-1 mt-1">
                    View Details &rarr;
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Best For */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="px-5 py-3 bg-gray-50 dark:bg-zinc-950 border-b border-gray-200 dark:border-zinc-800">
              <h3 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wider">Best For</h3>
            </div>
            <div className="flex flex-col divide-y divide-gray-100 dark:divide-zinc-800/50">
              {tools.map(tool => (
                <div key={tool.id} className="p-5">
                  <h4 className="text-xs font-semibold text-brand-600 dark:text-brand-500 uppercase tracking-wider mb-2">{tool.name}</h4>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-relaxed">{tool.bestFor || "General use"}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Pricing */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="px-5 py-3 bg-gray-50 dark:bg-zinc-950 border-b border-gray-200 dark:border-zinc-800">
              <h3 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wider">Pricing</h3>
            </div>
            <div className="flex flex-col divide-y divide-gray-100 dark:divide-zinc-800/50">
              {tools.map(tool => (
                <div key={tool.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h4 className="text-xs font-semibold text-brand-600 dark:text-brand-500 uppercase tracking-wider">{tool.name}</h4>
                  <span className="inline-flex self-start sm:self-auto items-center rounded-lg bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 px-3 py-1.5 text-sm font-medium text-gray-800 dark:text-gray-200 shadow-sm">
                    {tool.pricing || "Not specified"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Features */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="px-5 py-3 bg-gray-50 dark:bg-zinc-950 border-b border-gray-200 dark:border-zinc-800">
              <h3 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wider">Key Features</h3>
            </div>
            <div className="flex flex-col divide-y divide-gray-100 dark:divide-zinc-800/50">
              {tools.map(tool => (
                <div key={tool.id} className="p-5">
                  <h4 className="text-xs font-semibold text-brand-600 dark:text-brand-500 uppercase tracking-wider mb-3">{tool.name}</h4>
                  <ul className="space-y-3">
                    {tool.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <svg className="w-4 h-4 text-brand-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Actions Stack */}
          <div className="flex flex-col gap-4 mt-2">
            {tools.map(tool => (
              <div key={tool.id}>
                {tool.websiteUrl ? (
                  <a 
                    href={tool.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex justify-center items-center gap-2 rounded-xl bg-gray-900 dark:bg-white px-4 py-4 text-sm font-semibold text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 shadow-sm"
                  >
                    Visit {tool.name}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                ) : (
                  <button disabled className="w-full rounded-xl bg-gray-100 dark:bg-zinc-800 px-4 py-4 text-sm font-semibold text-gray-400 dark:text-gray-500 cursor-not-allowed border border-gray-200 dark:border-zinc-700">
                    {tool.name} Unavailable
                  </button>
                )}
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
