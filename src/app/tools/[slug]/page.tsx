import { MOCK_RECOMMENDATIONS } from "@/data/recommendations";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ToolCard } from "@/components/ToolCard";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return MOCK_RECOMMENDATIONS.map((tool) => ({
    slug: tool.slug,
  }));
}

function OfficialWebsiteAction({ tool }: { tool: typeof MOCK_RECOMMENDATIONS[0] }) {
  return tool.websiteUrl ? (
    <a 
      href={tool.websiteUrl} 
      target="_blank" 
      rel="noopener noreferrer"
      className="w-full sm:w-auto rounded-xl bg-brand-600 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 flex justify-center items-center gap-2 shadow-sm"
      aria-label={`Visit official website for ${tool.name} (opens in a new tab)`}
    >
      Visit Official Website
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    </a>
  ) : (
    <button 
      disabled
      className="w-full sm:w-auto rounded-xl bg-gray-200 dark:bg-zinc-800 px-8 py-4 text-base font-semibold text-gray-500 dark:text-gray-400 cursor-not-allowed flex justify-center items-center gap-2"
    >
      Official website unavailable
      <svg className="h-5 w-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    </button>
  );
}

export default async function ToolDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

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
    <div className="flex min-h-screen flex-col items-center p-6 sm:p-12 md:p-20 bg-gray-50 dark:bg-zinc-950">
      <main className="w-full max-w-4xl flex flex-col gap-12">
        
        {/* 1. Breadcrumb/navigation */}
        <nav className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400" aria-label="Breadcrumb">
          <Link href="/discover" className="hover:text-brand-600 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 rounded px-1 -ml-1">
            Discover
          </Link>
          <svg className="mx-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-900 dark:text-gray-100 font-semibold" aria-current="page">{tool.name}</span>
        </nav>

        {/* 2-7. Tool Header Section */}
        <div className="flex flex-col gap-8 bg-white dark:bg-zinc-900 p-8 sm:p-10 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-sm">
          
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* 3. Tool logo (Placeholder using first letter) */}
            <div className="w-20 h-20 shrink-0 rounded-2xl bg-gradient-to-br from-brand-100 to-brand-50 dark:from-brand-900/40 dark:to-brand-800/20 flex items-center justify-center border border-brand-200 dark:border-brand-800/50">
              <span className="text-4xl font-bold text-brand-600 dark:text-brand-400" aria-hidden="true">
                {tool.name.charAt(0)}
              </span>
            </div>
            
            <div className="flex-1 flex flex-col gap-3">
              {/* 6. Category/relevant metadata */}
              <div className="flex items-center gap-3 flex-wrap">
                <span className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
                  {tool.category}
                </span>
                {tool.pricing && (
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-zinc-800 dark:text-gray-400">
                    {tool.pricing}
                  </span>
                )}
              </div>
              
              {/* 4. Tool name */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
                {tool.name}
              </h1>
              
              {/* 5. Short description */}
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
                {tool.description}
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 dark:border-zinc-800 flex flex-col sm:flex-row gap-4 items-center">
            {/* 7. Primary action */}
            <div className="w-full sm:w-auto">
              <OfficialWebsiteAction tool={tool} />
            </div>
            
            {/* Compare Action */}
            <Link 
              href={`/compare?tools=${tool.slug}`}
              className="w-full sm:w-auto rounded-xl border border-gray-200 bg-white px-8 py-4 text-base font-semibold text-gray-900 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700 text-center flex items-center justify-center gap-2"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Compare
            </Link>
          </div>
        </div>

        {/* 8. Quick information */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm flex flex-col gap-2">
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Category</h2>
            <p className="text-base font-semibold text-gray-900 dark:text-white">{tool.category}</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm flex flex-col gap-2">
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Pricing</h2>
            <p className="text-base font-semibold text-gray-900 dark:text-white">{tool.pricing || "Not specified"}</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm flex flex-col gap-2">
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Best For</h2>
            <p className="text-base font-semibold text-gray-900 dark:text-white">{tool.bestFor || "General Use"}</p>
          </div>
        </div>

        <div className="flex flex-col gap-12 mt-4">
          
          {/* 10. Key Features */}
          {tool.features && tool.features.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Key Features</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {tool.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm">
                    <svg className="h-5 w-5 text-brand-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 11. Best For (Deeper dive - optional if already handled cleanly in Quick Info, but requested as section if available) */}
          {tool.bestFor && (
            <section className="bg-gradient-to-br from-brand-50 to-white dark:from-zinc-900 dark:to-zinc-900/50 p-8 sm:p-10 rounded-3xl border border-brand-100 dark:border-zinc-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Who is this for?</h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                {tool.bestFor}
              </p>
            </section>
          )}

          {/* 12. Why We Recommend It */}
          {tool.reasons && tool.reasons.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                <svg className="h-7 w-7 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Why We Recommend It
              </h2>
              <div className="bg-white dark:bg-zinc-900 p-8 sm:p-10 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-sm">
                <ul className="space-y-6">
                  {tool.reasons.map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-4 text-lg text-gray-700 dark:text-gray-300">
                      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400 font-bold text-sm">
                        {idx + 1}
                      </div>
                      <span className="leading-relaxed">{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {/* 13. Pros / Considerations */}
          {(tool.pros?.length > 0 || tool.cons?.length > 0) && (
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tool.pros && tool.pros.length > 0 && (
                <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Pros
                  </h2>
                  <ul className="space-y-4">
                    {tool.pros.map((pro, idx) => (
                      <li key={idx} className="text-base text-gray-600 dark:text-gray-400 flex items-start gap-3">
                        <span className="text-green-500 mt-1" aria-hidden="true">•</span>
                        <span className="leading-relaxed">{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {tool.cons && tool.cons.length > 0 && (
                <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Considerations
                  </h2>
                  <ul className="space-y-4">
                    {tool.cons.map((con, idx) => (
                      <li key={idx} className="text-base text-gray-600 dark:text-gray-400 flex items-start gap-3">
                        <span className="text-red-500 mt-1" aria-hidden="true">•</span>
                        <span className="leading-relaxed">{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}

          {/* 15. Final action */}
          <section className="flex flex-col items-center justify-center text-center p-12 bg-gray-900 dark:bg-black rounded-3xl mt-4 shadow-xl border border-gray-800 dark:border-zinc-800">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to try {tool.name}?</h2>
            <p className="text-gray-300 mb-8 max-w-lg text-lg">
              Head over to their official website to get started with this AI tool.
            </p>
            <OfficialWebsiteAction tool={tool} />
          </section>

          {/* 14. Alternatives */}
          {alternatives.length > 0 && (
            <section className="mt-8 pt-12 border-t border-gray-200 dark:border-zinc-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">You may also consider</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {alternatives.map((alt) => (
                  <ToolCard key={alt.id} tool={alt} />
                ))}
              </div>
            </section>
          )}

        </div>
      </main>
    </div>
  );
}
