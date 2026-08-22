"use client";

import { useProjects } from "@/context/ProjectsContext";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { MOCK_RECOMMENDATIONS } from "@/data/recommendations";
import { ToolCard } from "@/components/ToolCard";
import { AuthGuard } from "@/components/AuthGuard";
import { Dialog } from "@/components/Dialog";

export default function ProjectDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { projects, addToolToProject, removeToolFromProject, renameProject } = useProjects();

  const [mounted, setMounted] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const [renameError, setRenameError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [compareSlugs, setCompareSlugs] = useState<string[]>([]);

  useEffect(() => {
    // eslint-disable-next-line
    setMounted(true);
  }, []);

  const project = useMemo(() => projects.find((p) => p.id === id), [projects, id]);

  const handleRename = (e: React.FormEvent) => {
    e.preventDefault();
    if (!renameValue.trim()) {
      setRenameError("Project name is required.");
      return;
    }
    renameProject(project!.id, renameValue);
    setIsRenameOpen(false);
    setRenameError("");
  };

  const projectTools = useMemo(() => {
    if (!project || !project.toolIds) return [];
    return project.toolIds
      .map(slug => MOCK_RECOMMENDATIONS.find(t => t.slug === slug))
      .filter((t): t is NonNullable<typeof t> => t !== undefined);
  }, [project]);

  const availableTools = useMemo(() => {
    const existingIds = new Set(project?.toolIds || []);
    return MOCK_RECOMMENDATIONS.filter(t => !existingIds.has(t.slug) && (
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase())
    ));
  }, [project, searchQuery]);

  if (!mounted) {
    return <div className="min-h-screen bg-gray-50 dark:bg-zinc-950" />;
  }

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

  const handleToggleCompare = (slug: string) => {
    setCompareSlugs(prev => {
      if (prev.includes(slug)) return prev.filter(s => s !== slug);
      if (prev.length >= 3) return prev;
      return [...prev, slug];
    });
  };

  const navigateToCompare = () => {
    if (compareSlugs.length > 0) {
      router.push(`/compare?tools=${compareSlugs.join(",")}`);
    }
  };

  const createdDate = new Date(project.createdAt).toLocaleDateString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric'
  });
  const updatedDate = new Date(project.updatedAt).toLocaleDateString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <AuthGuard>
      <div className="flex min-h-screen flex-col p-6 sm:p-12 md:p-20 bg-gray-50 dark:bg-zinc-950">
        <main className="w-full max-w-7xl mx-auto flex flex-col gap-8 animate-in fade-in duration-300 relative pb-24">
          
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
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
                      {project.name}
                    </h1>
                    <button 
                      onClick={() => {
                        setRenameValue(project.name);
                        setRenameError("");
                        setIsRenameOpen(true);
                      }}
                      className="p-2 text-gray-400 hover:text-brand-600 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
                      aria-label={`Rename ${project.name}`}
                      title="Rename Project"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                  </div>
                  {project.description && (
                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mt-2">
                      {project.description}
                    </p>
                  )}
                </div>
                <button 
                  onClick={() => setIsAddOpen(true)}
                  className="shrink-0 flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 shadow-sm"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Tool
                </button>
              </div>
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

          {/* Workspace */}
          {projectTools.length === 0 ? (
            <div className="w-full flex flex-col items-center justify-center py-24 px-6 border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-3xl bg-white/50 dark:bg-zinc-900/50 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No tools in this project yet</h2>
              <p className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-8 max-w-md leading-relaxed">
                Add AI tools you want to use for this project.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button 
                  onClick={() => setIsAddOpen(true)}
                  className="rounded-xl border border-gray-300 bg-white dark:bg-zinc-800 dark:border-zinc-700 px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200 transition-colors hover:bg-gray-50 dark:hover:bg-zinc-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                >
                  Search Saved Tools
                </button>
                <Link 
                  href="/discover"
                  className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                >
                  Discover AI Tools
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projectTools.map(tool => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  isSelected={compareSlugs.includes(tool.slug)}
                  onToggleCompare={() => handleToggleCompare(tool.slug)}
                  disabledCompare={compareSlugs.length >= 3}
                  onRemoveFromProject={() => removeToolFromProject(project.id, tool.slug)}
                />
              ))}
            </div>
          )}

        </main>

        {/* Floating Compare Bar */}
        {compareSlugs.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 p-4 sm:p-6 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-t border-gray-200 dark:border-zinc-800 shadow-[0_-8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_-8px_30px_rgb(0,0,0,0.2)] z-40 transform transition-all duration-300 translate-y-0">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  {compareSlugs.map((slug) => {
                    const t = MOCK_RECOMMENDATIONS.find(t => t.slug === slug);
                    return (
                      <div key={slug} className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900 border-2 border-white dark:border-zinc-900 flex items-center justify-center text-sm font-bold text-brand-700 dark:text-brand-300 shadow-sm">
                        {t?.name.charAt(0)}
                      </div>
                    );
                  })}
                </div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  {compareSlugs.length} {compareSlugs.length === 1 ? 'tool' : 'tools'} selected
                  <span className="text-gray-500 dark:text-gray-400 font-normal ml-1">(max 3)</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button 
                  onClick={() => setCompareSlugs([])}
                  className="flex-1 sm:flex-none px-4 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Clear
                </button>
                <button 
                  onClick={navigateToCompare}
                  disabled={compareSlugs.length < 2}
                  className="flex-1 sm:flex-none rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  Compare Tools
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Tool Modal */}
        <Dialog 
          isOpen={isAddOpen} 
          onClose={() => setIsAddOpen(false)} 
          title="Add AI Tool"
          description="Search for tools to add to this project."
        >
          <div className="mt-4 flex flex-col gap-6">
            <input
              type="search"
              autoFocus
              aria-label="Search available tools"
              placeholder="Search AI tools..."
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:ring-brand-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div className="flex flex-col gap-2 max-h-80 overflow-y-auto pr-2 -mr-2">
              {availableTools.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
                  No tools found.
                </div>
              ) : (
                availableTools.map(tool => (
                  <div key={tool.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50">
                    <div className="flex flex-col pr-4">
                      <span className="font-semibold text-gray-900 dark:text-white text-sm">{tool.name}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{tool.description}</span>
                    </div>
                    <button
                      onClick={() => {
                        addToolToProject(project.id, tool.slug);
                      }}
                      className="shrink-0 rounded-lg bg-white dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 px-3 py-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-zinc-600 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="flex items-center justify-end pt-4 border-t border-gray-100 dark:border-zinc-800">
              <button
                onClick={() => setIsAddOpen(false)}
                className="rounded-xl bg-gray-100 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200 dark:bg-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-700"
              >
                Done
              </button>
            </div>
          </div>
        </Dialog>

        {/* Rename Project Modal */}
        <Dialog 
          isOpen={isRenameOpen} 
          onClose={() => setIsRenameOpen(false)} 
          title="Rename Project"
        >
          <form onSubmit={handleRename} className="flex flex-col gap-6 mt-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="renameProjectName" className="text-sm font-semibold text-gray-900 dark:text-white">
                Project Name <span className="text-red-500">*</span>
              </label>
              <input
                id="renameProjectName"
                type="text"
                autoFocus
                maxLength={50}
                className={`w-full rounded-xl border ${renameError ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-200'} bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:ring-brand-500`}
                placeholder="e.g., College Presentation"
                value={renameValue}
                onChange={(e) => {
                  setRenameValue(e.target.value);
                  if (e.target.value.trim()) setRenameError("");
                }}
              />
              {renameError && <p className="text-sm text-red-500 font-medium">{renameError}</p>}
            </div>

            <div className="flex items-center justify-end gap-3 mt-4 pt-6 border-t border-gray-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setIsRenameOpen(false)}
                className="rounded-xl px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-zinc-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 shadow-sm"
              >
                Save
              </button>
            </div>
          </form>
        </Dialog>

      </div>
    </AuthGuard>
  );
}
