"use client";

import { useState, useMemo } from "react";
import { TaskInput } from "@/components/TaskInput";
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
  const [hasTask, setHasTask] = useState(false);
  
  const { projects, deleteProject } = useProjects();
  const { favorites } = useFavorites();
  const recentSlugs = useRecentlyViewed();

  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  // Derived state for the dashboard widgets
  const fallbackRecommendations = useMemo(() => MOCK_RECOMMENDATIONS.slice(0, 3), []);
  
  const recentProjects = useMemo(() => projects.slice(0, 2), [projects]);
  
  const savedTools = useMemo(() => {
    return favorites
      .slice(0, 3)
      .map(slug => MOCK_RECOMMENDATIONS.find(t => t.slug === slug))
      .filter((t): t is NonNullable<typeof t> => t !== undefined);
  }, [favorites]);

  const recentlyViewedTools = useMemo(() => {
    return recentSlugs
      .map(slug => MOCK_RECOMMENDATIONS.find(t => t.slug === slug))
      .filter((t): t is NonNullable<typeof t> => t !== undefined);
  }, [recentSlugs]);

  const confirmDelete = () => {
    if (projectToDelete) {
      deleteProject(projectToDelete.id);
      setProjectToDelete(null);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center p-6 sm:p-12 md:p-20 bg-gray-50 dark:bg-zinc-950">
      <main className="w-full max-w-6xl flex flex-col gap-12">
        
        {/* Top Header / Greeting */}
        {!hasTask && (
          <div className="flex flex-col items-center text-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-gray-900 dark:text-white">
              What are you working on?
            </h1>
            <p className="max-w-xl text-lg text-gray-600 dark:text-gray-400">
              Describe your task, and we&apos;ll recommend the best AI tools to help you get it done.
            </p>
          </div>
        )}

        {/* Task Input takes over state handling natively */}
        <div className="w-full max-w-4xl mx-auto">
          <TaskInput onTaskResolved={(ctx) => setHasTask(!!ctx)} />
        </div>

        {/* Dashboard Sections (Hidden when a task is active) */}
        {!hasTask && (
          <div className="flex flex-col gap-16 mt-8 animate-in fade-in duration-700">
            
            {/* Recommendations Fallback */}
            <section className="flex flex-col gap-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <svg className="w-6 h-6 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                Recommended for you
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fallbackRecommendations.map(tool => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </section>

            {/* Split Row: Recent Projects & Saved Tools */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8">
              
              {/* Recent Projects */}
              <section className="flex flex-col gap-6">
                <div className="flex items-end justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <svg className="w-6 h-6 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                    Recent Projects
                  </h2>
                  <Link href="/projects" className="text-sm font-semibold text-brand-600 dark:text-brand-400 hover:underline">
                    View all projects
                  </Link>
                </div>
                
                {recentProjects.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {recentProjects.map(project => (
                      <ProjectCard key={project.id} project={project} onDelete={(p) => setProjectToDelete(p)} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-3xl bg-white/50 dark:bg-zinc-900/50 h-[300px]">
                    <p className="text-lg text-gray-500 dark:text-gray-400 mb-4">No projects yet.</p>
                    <Link href="/projects" className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-500 shadow-sm">
                      Create Project
                    </Link>
                  </div>
                )}
              </section>

              {/* Saved Tools */}
              <section className="flex flex-col gap-6">
                <div className="flex items-end justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <svg className="w-6 h-6 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    Saved Tools
                  </h2>
                  <Link href="/favorites" className="text-sm font-semibold text-brand-600 dark:text-brand-400 hover:underline">
                    View all favorites
                  </Link>
                </div>

                {savedTools.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {savedTools.map(tool => (
                      <ToolCard key={tool.id} tool={tool} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-3xl bg-white/50 dark:bg-zinc-900/50 h-[300px]">
                    <p className="text-lg text-gray-500 dark:text-gray-400 mb-4">You haven&apos;t saved any tools yet.</p>
                    <Link href="/discover" className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-500 shadow-sm">
                      Discover AI Tools
                    </Link>
                  </div>
                )}
              </section>
            </div>

            {/* Recently Viewed Tools */}
            {recentlyViewedTools.length > 0 && (
              <section className="flex flex-col gap-6 pt-8 border-t border-gray-200 dark:border-zinc-800">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <svg className="w-6 h-6 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Recently Viewed
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recentlyViewedTools.map(tool => (
                    <ToolCard key={tool.id} tool={tool} />
                  ))}
                </div>
              </section>
            )}

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
