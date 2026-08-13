import { MOCK_RECOMMENDATIONS } from "@/data/recommendations";
import Link from "next/link";
import { notFound } from "next/navigation";

interface ComparePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const resolvedParams = await searchParams;
  const toolsParam = resolvedParams.tools;
  
  if (!toolsParam || typeof toolsParam !== "string") {
    return notFound();
  }

  const slugs = toolsParam.split(",").filter(Boolean);
  const tools = slugs
    .map(slug => MOCK_RECOMMENDATIONS.find(t => t.slug === slug))
    .filter((t): t is typeof MOCK_RECOMMENDATIONS[0] => t !== undefined);

  if (tools.length < 2 || tools.length > 3) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-gray-50 dark:bg-zinc-950">
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Invalid Comparison</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Please select 2 to 3 tools to compare.</p>
        <Link href="/" className="text-brand-600 font-medium hover:underline">Back to Discover</Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col p-6 sm:p-12 md:p-20 bg-gray-50 dark:bg-zinc-950">
      <main className="w-full max-w-7xl mx-auto flex flex-col gap-8">
        
        {/* Breadcrumbs / Header */}
        <div className="flex flex-col gap-4">
          <nav className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-brand-600 transition-colors">
              Discover
            </Link>
            <svg className="mx-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 dark:text-gray-100" aria-current="page">Compare Tools</span>
          </nav>
          
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white">
            Tool Comparison
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Comparing {tools.length} selected tools.
          </p>
        </div>

        {/* Side by side comparison grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 ${tools.length === 3 ? 'lg:grid-cols-3' : ''} gap-6 w-full`}>
          {tools.map(tool => (
            <div key={tool.id} className="flex flex-col h-full rounded-3xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 transition-shadow hover:shadow-md">
              {/* Header */}
              <div className="mb-6">
                <div className="inline-flex items-center rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-600 dark:bg-brand-900/30 dark:text-brand-400 mb-4">
                  {tool.category}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{tool.name}</h2>
                <div className="text-xl font-medium text-gray-600 dark:text-gray-300">{tool.pricing}</div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {tool.description}
                </p>
              </div>

              {/* Details Sections */}
              <div className="flex flex-col gap-6 mb-8 flex-grow">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 border-b border-gray-100 dark:border-zinc-800 pb-2">Best For</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{tool.bestFor}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 border-b border-gray-100 dark:border-zinc-800 pb-2">Key Strengths</h3>
                  <ul className="space-y-2">
                    {tool.features.slice(0, 4).map((feature: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <span className="text-brand-500 mt-0.5">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 border-b border-gray-100 dark:border-zinc-800 pb-2">Why Recommended</h3>
                  <ul className="space-y-2">
                    {tool.reasons.map((reason: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <svg className="h-4 w-4 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action */}
              <div className="mt-auto pt-6 border-t border-gray-100 dark:border-zinc-800">
                {tool.websiteUrl ? (
                  <a 
                    href={tool.websiteUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 flex justify-center items-center gap-2"
                    aria-label={`Visit official website for ${tool.name} (opens in a new tab)`}
                  >
                    Visit Official Website
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                ) : (
                  <button 
                    disabled
                    className="w-full rounded-xl bg-gray-100 dark:bg-zinc-800 px-4 py-3 text-sm font-semibold text-gray-500 dark:text-gray-400 cursor-not-allowed flex justify-center items-center gap-2"
                  >
                    Official website unavailable
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        
      </main>
    </div>
  );
}
