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

export default async function ToolDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const tool = MOCK_RECOMMENDATIONS.find((t) => t.slug === slug);

  if (!tool) {
    notFound();
  }

  // Get some alternative tools (just excluding current)
  const alternatives = MOCK_RECOMMENDATIONS.filter((t) => t.slug !== slug).slice(0, 3);

  return (
    <div className="flex min-h-screen flex-col items-center p-6 sm:p-12 md:p-20 bg-gray-50 dark:bg-zinc-950">
      <main className="w-full max-w-5xl flex flex-col gap-8">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 mb-4" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-brand-600 transition-colors">
            Discover
          </Link>
          <svg className="mx-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-900 dark:text-gray-100" aria-current="page">{tool.name}</span>
        </nav>

        {/* Tool Header Section */}
        <div className="flex flex-col md:flex-row gap-8 items-start justify-between bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-sm">
          <div className="flex-1">
            <div className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600 dark:bg-brand-900/30 dark:text-brand-400 mb-4">
              {tool.category}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {tool.name}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
              {tool.description}
            </p>
          </div>

          <div className="w-full md:w-auto flex flex-col gap-3 min-w-[240px]">
            {tool.websiteUrl ? (
              <a 
                href={tool.websiteUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full rounded-xl bg-brand-600 px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-brand-500 flex justify-center items-center gap-2"
              >
                Visit Tool
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ) : (
              <button 
                disabled
                className="w-full rounded-xl bg-gray-200 dark:bg-zinc-800 px-6 py-3.5 text-base font-semibold text-gray-500 dark:text-gray-400 cursor-not-allowed flex justify-center items-center gap-2"
              >
                Website Not Available
                <svg className="h-4 w-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </button>
            )}
            <div className="flex gap-2">
              <button className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700 text-center">
                Compare
              </button>
              <button className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700 text-center flex items-center justify-center gap-2">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                Save
              </button>
            </div>
          </div>
        </div>

        {/* Two Column Layout for Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
          
          {/* Main Column */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Why We Recommend It */}
            <section className="bg-brand-50/50 dark:bg-brand-900/10 rounded-3xl p-8 border border-brand-100 dark:border-brand-900/30">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <svg className="h-6 w-6 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Why We Recommend It
              </h2>
              <ul className="space-y-4">
                {tool.reasons.map((reason, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-base text-gray-700 dark:text-gray-300">
                    <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400 font-bold text-xs">
                      {idx + 1}
                    </div>
                    <span className="leading-relaxed">{reason}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Pros & Cons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Pros
                </h3>
                <ul className="space-y-3">
                  {tool.pros.map((pro, idx) => (
                    <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">•</span>
                      {pro}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cons
                </h3>
                <ul className="space-y-3">
                  {tool.cons.map((con, idx) => (
                    <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                      <span className="text-red-500 mt-0.5">•</span>
                      {con}
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="flex flex-col gap-6">
            <section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Best For</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">{tool.bestFor}</p>

              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Pricing</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">{tool.pricing}</p>

              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Key Features</h3>
              <ul className="space-y-2">
                {tool.features.map((feature, idx) => (
                  <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2 bg-gray-50 dark:bg-zinc-800/50 p-2 rounded-lg">
                    <svg className="h-4 w-4 text-brand-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </section>
          </div>

        </div>

        {/* Alternatives Section */}
        {alternatives.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Alternative Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {alternatives.map((alt) => (
                <ToolCard key={alt.id} tool={alt} />
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
