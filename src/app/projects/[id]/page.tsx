"use client";

import { useProjects } from "@/context/ProjectsContext";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";

export default function ProjectDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { projects } = useProjects();

  // We need to wait for client hydration to read context/localStorage reliably
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line
    setMounted(true);
  }, []);

  const project = useMemo(() => projects.find((p) => p.id === id), [projects, id]);

  // Handle mounting state to avoid hydration mismatch
  if (!mounted) {
    return <div className="min-h-screen bg-gray-50 dark:bg-zinc-950" />;
  }

  // Handle not found
  if (!project) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-50 dark:bg-zinc-950">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Project not found</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">This project may have been deleted or does not exist.</p>
        <Link 
          href="/projects"
          className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-500 shadow-sm"
        >
          Back to Projects
        </Link>
      </div>
    );
  }

  const createdDate = new Date(project.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const updatedDate = new Date(project.updatedAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="flex min-h-screen flex-col p-6 sm:p-12 md:p-20 bg-gray-50 dark:bg-zinc-950">
      <main className="w-full max-w-5xl mx-auto flex flex-col gap-8 animate-in fade-in duration-300">
        
        {/* Navigation */}
        <nav className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400" aria-label="Breadcrumb">
          <Link href="/projects" className="flex items-center gap-2 hover:text-brand-600 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 rounded px-1 -ml-1">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Projects
          </Link>
        </nav>

        {/* Header */}
        <div className="flex flex-col gap-6 bg-white dark:bg-zinc-900 p-8 sm:p-10 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-sm">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
              {project.name}
            </h1>
            {project.description && (
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mt-2">
                {project.description}
              </p>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-gray-100 dark:border-zinc-800 text-sm font-medium text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Created {createdDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Updated {updatedDate}</span>
            </div>
          </div>
        </div>

        {/* Workspace Placeholder */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Project Workspace</h2>
          <div className="w-full flex flex-col items-center justify-center py-32 px-6 border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-3xl bg-white/50 dark:bg-zinc-900/50">
            <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p className="text-lg font-medium text-gray-500 dark:text-gray-400 text-center">
              Your project workspace will appear here.
            </p>
          </div>
        </div>

      </main>
    </div>
  );
}
