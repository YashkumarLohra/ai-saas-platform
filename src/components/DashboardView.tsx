"use client";

import { useState, useMemo, useEffect } from "react";
import { ToolCard } from "@/components/ToolCard";
import { ProjectCard } from "@/components/ProjectCard";
import { useProjects } from "@/context/ProjectsContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { MOCK_RECOMMENDATIONS } from "@/data/recommendations";
import Link from "next/link";
import { Project } from "@/types/index";
import { Dialog } from "@/components/Dialog";

export function DashboardView() {
  const [mounted, setMounted] = useState(false);
  
  const { projects, deleteProject } = useProjects();
  const { favorites } = useFavorites();
  const recentSlugs = useRecentlyViewed();

  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  useEffect(() => {
    // eslint-disable-next-line
    setMounted(true);
  }, []);

  // Derived state for the dashboard widgets
  const recentProjects = useMemo(() => projects.slice(0, 3), [projects]);
  
  const savedTools = useMemo(() => {
    return favorites
      .map(slug => MOCK_RECOMMENDATIONS.find(t => t.slug === slug))
      .filter((t): t is NonNullable<typeof t> => t !== undefined)
      .slice(0, 3);
  }, [favorites]);

  const recentlyViewedTools = useMemo(() => {
    return recentSlugs
      .map(slug => MOCK_RECOMMENDATIONS.find(t => t.slug === slug))
      .filter((t): t is NonNullable<typeof t> => t !== undefined)
      .slice(0, 6);
  }, [recentSlugs]);

  const confirmDelete = () => {
    if (projectToDelete) {
      deleteProject(projectToDelete.id);
      setProjectToDelete(null);
    }
  };

  return (
    <div className="flex min-h-screen flex-col p-6 sm:p-12 md:p-20 bg-gray-50 dark:bg-zinc-950">
      <main className="w-full max-w-7xl mx-auto flex flex-col gap-12 sm:gap-16">
        
        {/* Top Header / Workspace Introduction */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-8 sm:p-10 shadow-sm">
          <div className="flex flex-col gap-3">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-gray-900 dark:text-white">
              Your AI Workspace
            </h1>
            <p className="max-w-2xl text-lg text-gray-600 dark:text-gray-400 text-balance">
              Continue exploring tools and discover the right AI solutions for your work.
            </p>
          </div>
          <Link 
            href="/discover"
            className="inline-flex items-center justify-center rounded-xl bg-brand-600 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-brand-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 whitespace-nowrap gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Discover AI Tools
          </Link>
        </div>

        {/* Dashboard Sections */}
        {mounted && (
          <div className="flex flex-col gap-16 animate-in fade-in duration-500">
            
            {/* Recently Viewed Tools */}
            <section className="flex flex-col gap-6">
              <div className="flex items-end justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 tracking-tight">
                  <svg className="w-6 h-6 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Recently Viewed
                </h2>
                {recentlyViewedTools.length > 0 && (
                  <button 
                    onClick={() => {
                      import("@/hooks/useRecentlyViewed").then(m => m.clearRecentlyViewed());
                    }} 
                    className="text-sm font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-500 hover:underline focus:outline-none focus:ring-2 focus:ring-brand-500 rounded px-2 py-1 -mr-2 transition-colors"
                  >
                    Clear history
                  </button>
                )}
              </div>
              
              {recentlyViewedTools.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recentlyViewedTools.map(tool => (
                    <ToolCard key={tool.id} tool={tool} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 px-6 text-center border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-3xl bg-white/50 dark:bg-zinc-900/50">
                  <svg className="h-10 w-10 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-lg font-bold text-gray-900 dark:text-white mb-2">No recently viewed tools</p>
                  <p className="text-base text-gray-500 dark:text-gray-400 mb-6 max-w-md">
                    Tools you explore will appear here.
                  </p>
                  <Link href="/discover" className="rounded-xl bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 px-6 py-2.5 text-sm font-semibold text-gray-900 dark:text-white transition-colors hover:bg-gray-50 dark:hover:bg-zinc-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2">
                    Discover AI Tools
                  </Link>
                </div>
              )}
            </section>

            {/* Saved Tools */}
            <section className="flex flex-col gap-6">
              <div className="flex items-end justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 tracking-tight">
                  <svg className="w-6 h-6 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Saved Tools
                </h2>
                {favorites.length > 0 && (
                  <Link href="/favorites" className="text-sm font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-500 hover:underline focus:outline-none focus:ring-2 focus:ring-brand-500 rounded px-2 py-1 -mr-2 transition-colors">
                    View all saved tools
                  </Link>
                )}
              </div>

              {savedTools.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedTools.map(tool => (
                    <ToolCard key={tool.id} tool={tool} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 px-6 text-center border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-3xl bg-white/50 dark:bg-zinc-900/50">
                  <svg className="h-10 w-10 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <p className="text-lg font-bold text-gray-900 dark:text-white mb-2">No saved tools yet</p>
                  <p className="text-base text-gray-500 dark:text-gray-400 mb-6 max-w-md">
                    Save useful AI tools so you can quickly return to them.
                  </p>
                  <Link href="/discover" className="rounded-xl bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 px-6 py-2.5 text-sm font-semibold text-gray-900 dark:text-white transition-colors hover:bg-gray-50 dark:hover:bg-zinc-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2">
                    Discover AI Tools
                  </Link>
                </div>
              )}
            </section>

            {/* Recent Projects */}
            <section className="flex flex-col gap-6">
              <div className="flex items-end justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 tracking-tight">
                  <svg className="w-6 h-6 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                  Recent Projects
                </h2>
                {projects.length > 0 && (
                  <Link href="/projects" className="text-sm font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-500 hover:underline focus:outline-none focus:ring-2 focus:ring-brand-500 rounded px-2 py-1 -mr-2 transition-colors">
                    View all projects
                  </Link>
                )}
              </div>
              
              {recentProjects.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recentProjects.map(project => (
                    <ProjectCard key={project.id} project={project} onDelete={(p) => setProjectToDelete(p)} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 px-6 text-center border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-3xl bg-white/50 dark:bg-zinc-900/50">
                  <svg className="h-10 w-10 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                  <p className="text-lg font-bold text-gray-900 dark:text-white mb-2">No projects yet</p>
                  <p className="text-base text-gray-500 dark:text-gray-400 mb-6 max-w-md">
                    Create projects to organize your favorite AI tools by use-case.
                  </p>
                  <Link href="/projects" className="rounded-xl bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 px-6 py-2.5 text-sm font-semibold text-gray-900 dark:text-white transition-colors hover:bg-gray-50 dark:hover:bg-zinc-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 flex items-center gap-2 mx-auto">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Project
                  </Link>
                </div>
              )}
            </section>

            {/* Continue Exploring Block */}
            <section className="flex flex-col items-center justify-center py-16 px-6 text-center border border-gray-200 dark:border-zinc-800 rounded-3xl bg-white dark:bg-zinc-900 shadow-sm mt-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Explore AI Tools</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md">
                Browse our curated directory of premium AI tools to find your next solution.
              </p>
              <Link href="/discover" className="rounded-xl bg-brand-600 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-brand-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2">
                Browse Discover
              </Link>
            </section>

          </div>
        )}

      </main>

      {/* Delete Confirmation Modal for Projects Widget */}
      <Dialog 
        isOpen={projectToDelete !== null} 
        onClose={() => setProjectToDelete(null)} 
        title="Delete project?"
      >
        <div className="mt-4 flex flex-col gap-6">
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to delete <strong>&quot;{projectToDelete?.name}&quot;</strong>?
            <br/><br/>
            This action cannot be undone.
          </p>
          
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={() => setProjectToDelete(null)}
              className="rounded-xl px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-zinc-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmDelete}
              className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-sm"
            >
              Delete
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
