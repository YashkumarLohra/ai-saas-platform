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

  const allFeatures = useMemo(() => {
    const features = new Set<string>();
    tools.forEach(t => {
      if (t.features) {
        t.features.forEach(f => features.add(f));
      }
    });
    return Array.from(features).sort();
  }, [tools]);

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
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No tools to compare</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
          Choose AI tools from Discover and compare them side by side.
        </p>
        <Link 
          href="/discover"
          className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 shadow-sm"
        >
          Explore AI Tools
        </Link>
      </div>
    );
  }

  // MINIMUM STATE (1 tool)
  if (tools.length === 1) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-zinc-900 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-sm mt-8 animate-in fade-in duration-500">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">You&apos;re currently comparing 1 tool.</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md leading-relaxed">
          Add another tool to see meaningful differences.
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
            Add Another Tool
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
                  <div className="flex flex-col items-start text-left gap-4 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm relative group h-full">
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
                    
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-100 to-brand-50 dark:from-brand-900/40 dark:to-brand-800/20 flex items-center justify-center border border-brand-200 dark:border-brand-800/50">
                      <span className="text-2xl font-bold text-brand-600 dark:text-brand-400" aria-hidden="true">
                        {tool.name.charAt(0)}
                      </span>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{tool.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4 line-clamp-3">
                        {tool.description}
                      </p>
                    </div>

                    <div className="mt-auto flex flex-col gap-2 w-full pt-4 border-t border-gray-100 dark:border-zinc-800/50">
                      <Link 
                        href={`/tools/${tool.slug}`}
                        className="w-full text-center rounded-xl border border-gray-200 dark:border-zinc-700 px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white transition-colors hover:bg-gray-50 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm"
                      >
                        View Details
                      </Link>
                      {tool.isIntegrated ? (
                        <button className="w-full text-center rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm flex items-center justify-center gap-1.5">
                          Use in Platform
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </button>
                      ) : tool.websiteUrl ? (
                        <a 
                          href={tool.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full text-center rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm flex items-center justify-center gap-1.5"
                          aria-label={`Visit official tool website for ${tool.name} (opens in a new tab)`}
                        >
                          Visit Official Tool
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      ) : (
                        <button disabled className="w-full rounded-xl bg-gray-100 dark:bg-zinc-800 px-4 py-2 text-sm font-semibold text-gray-400 dark:text-gray-500 cursor-not-allowed">
                          Website unavailable
                        </button>
                      )}
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/50">
            {/* Category */}
            <tr>
              <th className="p-4 py-6 text-sm font-semibold text-gray-900 dark:text-white text-left align-top w-48">
                Category
              </th>
              {tools.map(tool => (
                <td key={tool.id} className="p-4 py-6 align-top">
                  <span className="inline-flex items-center rounded-lg bg-gray-100 dark:bg-zinc-800 px-3 py-1.5 text-sm font-medium text-gray-800 dark:text-gray-200 shadow-sm">
                    {tool.category}
                  </span>
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
                  <span className="inline-flex items-center rounded-lg bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 px-3 py-1.5 text-sm font-semibold text-gray-900 dark:text-white shadow-sm">
                    {tool.pricing || "Pricing unavailable"}
                  </span>
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
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-relaxed">{tool.bestFor || "Not specified"}</p>
                </td>
              ))}
            </tr>
            {/* Reasons */}
            <tr>
              <th className="p-4 py-6 text-sm font-semibold text-gray-900 dark:text-white text-left align-top">
                Top Reasons
              </th>
              {tools.map(tool => (
                <td key={tool.id} className="p-4 py-6 align-top">
                  <ul className="flex flex-col gap-2">
                    {tool.reasons?.map((reason, idx) => (
                      <li key={idx} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                        <svg className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="leading-relaxed">{reason}</span>
                      </li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>
            {/* Capabilities Header */}
            <tr>
              <th colSpan={tools.length + 1} className="p-4 pt-10 pb-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-left border-b border-gray-200 dark:border-zinc-800">
                Capabilities
              </th>
            </tr>
            {/* Capabilities Rows */}
            {allFeatures.map(feature => (
              <tr key={feature} className="hover:bg-gray-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                <th className="p-4 py-5 text-sm font-medium text-gray-700 dark:text-gray-300 text-left align-middle border-b border-gray-100 dark:border-zinc-800/50">
                  {feature}
                </th>
                {tools.map(tool => {
                  const hasFeature = tool.features?.includes(feature);
                  return (
                    <td key={tool.id} className="p-4 py-5 align-middle border-b border-gray-100 dark:border-zinc-800/50 text-center sm:text-left">
                      {hasFeature ? (
                        <span className="inline-flex items-center justify-center sm:justify-start gap-2 text-brand-600 dark:text-brand-500 font-medium" aria-label="Yes">
                          <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="hidden sm:inline-block text-sm">Yes</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center sm:justify-start gap-2 text-gray-400 dark:text-gray-600" aria-label="No">
                          <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
                          </svg>
                          <span className="hidden sm:inline-block text-sm">No</span>
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
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
                <div key={tool.id} className="p-5 flex flex-col gap-4 relative">
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
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3">{tool.description}</p>
                  
                  <div className="flex gap-2 w-full mt-2">
                    <Link href={`/tools/${tool.slug}`} className="flex-1 text-center rounded-xl border border-gray-200 dark:border-zinc-700 px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white transition-colors hover:bg-gray-50 dark:hover:bg-zinc-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                      View Details
                    </Link>
                    {tool.isIntegrated ? (
                      <button className="flex-1 text-center rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                        Use in Platform
                      </button>
                    ) : tool.websiteUrl ? (
                      <a 
                        href={tool.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 flex items-center justify-center gap-1"
                      >
                        Visit Official Tool
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    ) : null}
                  </div>
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
                  <span className="inline-flex self-start sm:self-auto items-center rounded-lg bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 px-3 py-1.5 text-sm font-semibold text-gray-900 dark:text-white shadow-sm">
                    {tool.pricing || "Pricing unavailable"}
                  </span>
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
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-relaxed">{tool.bestFor || "Not specified"}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Top Reasons */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="px-5 py-3 bg-gray-50 dark:bg-zinc-950 border-b border-gray-200 dark:border-zinc-800">
              <h3 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wider">Top Reasons</h3>
            </div>
            <div className="flex flex-col divide-y divide-gray-100 dark:divide-zinc-800/50">
              {tools.map(tool => (
                <div key={tool.id} className="p-5">
                  <h4 className="text-xs font-semibold text-brand-600 dark:text-brand-500 uppercase tracking-wider mb-3">{tool.name}</h4>
                  <ul className="flex flex-col gap-2">
                    {tool.reasons?.map((reason, idx) => (
                      <li key={idx} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                        <svg className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="leading-relaxed">{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Capabilities */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="px-5 py-3 bg-gray-50 dark:bg-zinc-950 border-b border-gray-200 dark:border-zinc-800">
              <h3 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wider">Capabilities</h3>
            </div>
            <div className="flex flex-col divide-y divide-gray-100 dark:divide-zinc-800/50">
              {allFeatures.map(feature => (
                <div key={feature} className="p-5">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3">{feature}</h4>
                  <div className="flex flex-col gap-2.5 pl-2">
                    {tools.map(tool => {
                      const hasFeature = tool.features?.includes(feature);
                      return (
                        <div key={tool.id} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">{tool.name}</span>
                          {hasFeature ? (
                            <svg className="w-5 h-5 text-brand-600 dark:text-brand-500 shrink-0" aria-label="Yes" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-gray-300 dark:text-gray-700 shrink-0" aria-label="No" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
                            </svg>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
