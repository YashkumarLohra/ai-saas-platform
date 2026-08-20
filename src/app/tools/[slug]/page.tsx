import { MOCK_RECOMMENDATIONS } from "@/data/recommendations";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ToolCard } from "@/components/ToolCard";
import { SaveToolButton } from "@/components/SaveToolButton";
import { RecentlyViewedTracker } from "@/components/RecentlyViewedTracker";
import { AddToProjectButton } from "@/components/AddToProjectButton";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateStaticParams() {
  return MOCK_RECOMMENDATIONS.map((tool) => ({
    slug: tool.slug,
  }));
}

function OfficialWebsiteAction({ tool }: { tool: typeof MOCK_RECOMMENDATIONS[0] }) {
  if (tool.isIntegrated) {
    return (
      <button 
        className="w-full sm:w-auto rounded-xl bg-brand-600 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 flex justify-center items-center gap-2 shadow-sm"
      >
        Use in Platform
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-2 items-center sm:items-start">
      {tool.websiteUrl ? (
        <a 
          href={tool.websiteUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full sm:w-auto rounded-xl bg-brand-600 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 flex justify-center items-center gap-2 shadow-sm"
          aria-label={`Visit official tool website for ${tool.name} (opens in a new tab)`}
        >
          Visit Official Tool
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      ) : (
        <button 
          disabled
          className="w-full sm:w-auto rounded-xl bg-gray-200 dark:bg-zinc-800 px-8 py-4 text-base font-semibold text-gray-500 dark:text-gray-400 cursor-not-allowed flex justify-center items-center gap-2"
        >
          Website unavailable
          <svg className="h-5 w-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </button>
      )}
      
      {tool.websiteUrl && (
        <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          You&apos;ll continue on the tool&apos;s official website.
        </span>
      )}
    </div>
  );
}

export default async function ToolDetailPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  
  let taskQuery: string | undefined;
  if (searchParams) {
    const resolvedSearchParams = await searchParams;
    if (typeof resolvedSearchParams.task === 'string') {
      taskQuery = resolvedSearchParams.task;
    }
  }

  const tool = MOCK_RECOMMENDATIONS.find((t) => t.slug === slug);

  if (!tool) {
    notFound();
  }

  // Get some alternative tools (just excluding current, maybe filtering by category)
  const alternatives = MOCK_RECOMMENDATIONS.filter((t) => t.category === tool.category && t.slug !== slug).slice(0, 3);
  if (alternatives.length === 0) {
    // fallback if no alternatives in same category
    alternatives.push(...MOCK_RECOMMENDATIONS.filter((t) => t.slug !== slug).slice(0, 3));
  }

  return (
    <div className="flex min-h-screen flex-col p-6 sm:p-12 md:p-20 bg-gray-50 dark:bg-zinc-950">
      <RecentlyViewedTracker slug={slug} />
      <main className="w-full max-w-5xl mx-auto flex flex-col gap-8 animate-in fade-in duration-300 relative">
        
        {/* 1. Breadcrumb/navigation */}
        <nav className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400" aria-label="Breadcrumb">
          <Link href="/discover" className="hover:text-brand-600 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 rounded px-1 -ml-1">
            Discover
          </Link>
          <svg className="mx-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          {tool.category && (
            <>
              <Link href={`/discover?category=${encodeURIComponent(tool.category)}`} className="hover:text-brand-600 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 rounded px-1 -ml-1 truncate max-w-[120px] sm:max-w-[200px]">
                {tool.category}
              </Link>
              <svg className="mx-2 h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </>
          )}
          <span className="text-gray-900 dark:text-gray-100 font-semibold truncate" aria-current="page">{tool.name}</span>
        </nav>

        {/* 2. Tool Identity */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-5 sm:gap-6">
            <div className="w-16 h-16 sm:w-24 sm:h-24 shrink-0 rounded-2xl bg-gradient-to-br from-brand-100 to-brand-50 dark:from-brand-900/40 dark:to-brand-800/20 flex items-center justify-center border border-brand-200 dark:border-brand-800/50 shadow-sm">
              <span className="text-3xl sm:text-5xl font-bold text-brand-600 dark:text-brand-400" aria-hidden="true">
                {tool.name.charAt(0)}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
                {tool.name}
              </h1>
              <div className="flex items-center gap-3 flex-wrap">
                <Link href={`/discover?category=${encodeURIComponent(tool.category)}`} className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600 dark:bg-brand-900/30 dark:text-brand-400 hover:bg-brand-100 dark:hover:bg-brand-900/50 transition-colors">
                  {tool.category}
                </Link>
                {tool.pricing && (
                  <span className="inline-flex items-center rounded-full bg-gray-200/50 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-zinc-800 dark:text-gray-300">
                    {tool.pricing}
                  </span>
                )}
              </div>
            </div>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-4xl">
            {tool.description}
          </p>
        </div>

        {/* Recommendation Context */}
        {taskQuery && (
          <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-2xl p-6 -mt-4 mb-2 shadow-sm flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 shadow-sm border border-amber-200 dark:border-amber-800/50">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-sm font-bold text-amber-800 dark:text-amber-500 uppercase tracking-wider flex items-center gap-2">
                Recommendation Match
              </h2>
              <p className="text-base text-amber-900 dark:text-amber-200 leading-relaxed">
                You were recommended <span className="font-semibold">{tool.name}</span> because it strongly matches your task: <span className="italic font-medium">&quot;{taskQuery}&quot;</span>
              </p>
            </div>
          </div>
        )}

        {/* 3. Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pb-8 border-b border-gray-200 dark:border-zinc-800">
          <div className="w-full sm:w-auto">
            <OfficialWebsiteAction tool={tool} />
          </div>
          <div className="flex gap-4 w-full sm:w-auto">
            <Link 
              href={`/compare?tools=${tool.slug}`}
              className="flex-1 sm:flex-none rounded-xl border border-gray-200 bg-white px-6 py-4 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700 text-center flex items-center justify-center gap-2 shadow-sm"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Compare
            </Link>
            <div className="flex-1 sm:flex-none flex gap-4">
              <SaveToolButton slug={tool.slug} toolName={tool.name} />
              <AddToProjectButton slug={tool.slug} toolName={tool.name} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Main Content Column */}
          <div className="lg:col-span-2 flex flex-col gap-12">
            
            {/* 4. Overview */}
            <section className="flex flex-col gap-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Overview</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed text-balance">
                {tool.longDescription || tool.description}
              </p>
            </section>

            {/* 5. Capabilities */}
            {tool.features && tool.features.length > 0 && (
              <section className="flex flex-col gap-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Capabilities</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                  {tool.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <svg className="h-5 w-5 text-brand-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-base text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Why We Recommend It */}
            {tool.reasons && tool.reasons.length > 0 && (
              <section className="flex flex-col gap-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                  Why consider this tool?
                </h2>
                <div className="bg-brand-50 dark:bg-brand-900/10 p-6 sm:p-8 rounded-2xl border border-brand-100 dark:border-brand-900/20">
                  <ul className="space-y-4">
                    {tool.reasons.map((reason, idx) => (
                      <li key={idx} className="flex items-start gap-4">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-200 dark:bg-brand-800 text-brand-700 dark:text-brand-300 font-bold text-xs mt-0.5">
                          {idx + 1}
                        </div>
                        <span className="text-base text-gray-800 dark:text-gray-200 leading-relaxed">{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            {/* Pros & Considerations */}
            {(tool.pros?.length > 0 || tool.cons?.length > 0) && (
              <section className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6 border-t border-gray-200 dark:border-zinc-800">
                {tool.pros && tool.pros.length > 0 && (
                  <div className="flex flex-col gap-4">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Pros
                    </h2>
                    <ul className="space-y-3">
                      {tool.pros.map((pro, idx) => (
                        <li key={idx} className="text-base text-gray-600 dark:text-gray-400 flex items-start gap-2">
                          <span className="text-green-500 mt-1" aria-hidden="true">•</span>
                          <span className="leading-relaxed">{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {tool.cons && tool.cons.length > 0 && (
                  <div className="flex flex-col gap-4">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Considerations
                    </h2>
                    <ul className="space-y-3">
                      {tool.cons.map((con, idx) => (
                        <li key={idx} className="text-base text-gray-600 dark:text-gray-400 flex items-start gap-2">
                          <span className="text-red-500 mt-1" aria-hidden="true">•</span>
                          <span className="leading-relaxed">{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            )}
          </div>

          {/* Sidebar / Meta Information */}
          <div className="flex flex-col gap-8 lg:border-l lg:border-gray-200 lg:dark:border-zinc-800 lg:pl-12">
            
            {/* 6. Best For */}
            {tool.bestFor && (
              <section className="flex flex-col gap-3">
                <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Best For
                </h2>
                <p className="text-base text-gray-900 dark:text-white font-medium">
                  {tool.bestFor}
                </p>
              </section>
            )}

            {/* Pricing */}
            <section className="flex flex-col gap-3">
              <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Pricing Model
              </h2>
              <p className="text-base text-gray-900 dark:text-white font-medium">
                {tool.pricing || "Pricing unavailable"}
              </p>
            </section>

            {/* Categories */}
            <section className="flex flex-col gap-3">
              <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Categories
              </h2>
              <div className="flex flex-wrap gap-2">
                <Link href={`/discover?category=${encodeURIComponent(tool.category)}`} className="inline-flex items-center rounded-lg bg-gray-100 dark:bg-zinc-800 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors">
                  {tool.category}
                </Link>
              </div>
            </section>
          </div>
        </div>

        {/* 7. Related Tools */}
        {alternatives.length > 0 && (
          <section className="mt-8 pt-12 border-t border-gray-200 dark:border-zinc-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight">Related Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {alternatives.map((alt) => (
                <ToolCard key={alt.id} tool={alt} />
              ))}
            </div>
          </section>
        )}

      </main>
    </div>
  );
}
