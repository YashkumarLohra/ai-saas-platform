"use client";

import { useState } from "react";
import Link from "next/link";
import { useProjects } from "@/context/ProjectsContext";
import { ProjectCard } from "@/components/ProjectCard";
import { AuthGuard } from "@/components/AuthGuard";
import { Dialog } from "@/components/Dialog";
import { Project } from "@/types/index";

export default function ProjectsPage() {
  const { projects, createProject, deleteProject } = useProjects();
  
  // Create Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const [createError, setCreateError] = useState("");

  // Delete Modal State
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) {
      setCreateError("Project name is required.");
      return;
    }
    createProject(newProjectName, newProjectDesc);
    setIsCreateOpen(false);
    setNewProjectName("");
    setNewProjectDesc("");
    setCreateError("");
  };

  const confirmDelete = () => {
    if (projectToDelete) {
      deleteProject(projectToDelete.id);
      setProjectToDelete(null);
    }
  };

  return (
    <AuthGuard>
      <div className="flex min-h-screen flex-col p-6 sm:p-12 md:p-20 bg-gray-50 dark:bg-zinc-950">
        <main className="w-full max-w-7xl mx-auto flex flex-col gap-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex flex-col gap-4">
              <nav className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400" aria-label="Breadcrumb">
                <Link href="/" className="hover:text-brand-600 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 rounded px-1 -ml-1">
                  Home
                </Link>
                <svg className="mx-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-gray-900 dark:text-gray-100 font-semibold" aria-current="page">Projects</span>
              </nav>
              
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
                Your Projects
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Organize your AI tools around your work.
              </p>
            </div>

            {projects.length > 0 && (
              <button 
                onClick={() => setIsCreateOpen(true)}
                className="shrink-0 flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 shadow-sm"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Project
              </button>
            )}
          </div>

          {/* Content */}
          {projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-in fade-in duration-500 mt-4 border border-dashed border-gray-200 dark:border-zinc-800 rounded-3xl bg-white/50 dark:bg-zinc-900/50">
              <div className="w-20 h-20 bg-gray-100 dark:bg-zinc-800 rounded-3xl flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">No projects yet</h2>
              <p className="text-lg text-gray-500 dark:text-gray-400 mb-10 max-w-sm leading-relaxed">
                Organize AI tools around the work you&apos;re doing.
              </p>
              <button 
                onClick={() => setIsCreateOpen(true)}
                className="rounded-xl bg-brand-600 px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 shadow-sm flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-4 animate-in fade-in duration-300">
              {projects.map((project) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  onDelete={(p) => setProjectToDelete(p)}
                />
              ))}
            </div>
          )}

          {/* Create Project Modal */}
          <Dialog 
            isOpen={isCreateOpen} 
            onClose={() => setIsCreateOpen(false)} 
            title="Create New Project"
            description="Create a new workspace to organize your tasks and tools."
          >
            <form onSubmit={handleCreate} className="flex flex-col gap-6 mt-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="projectName" className="text-sm font-semibold text-gray-900 dark:text-white">
                  Project Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="projectName"
                  type="text"
                  autoFocus
                  maxLength={50}
                  className={`w-full rounded-xl border ${createError ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-200'} bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:ring-brand-500`}
                  placeholder="e.g., College Presentation"
                  value={newProjectName}
                  onChange={(e) => {
                    setNewProjectName(e.target.value);
                    if (e.target.value.trim()) setCreateError("");
                  }}
                />
                {createError && <p className="text-sm text-red-500 font-medium">{createError}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="projectDesc" className="text-sm font-semibold text-gray-900 dark:text-white">
                  Description <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  id="projectDesc"
                  rows={3}
                  maxLength={150}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:ring-brand-500 resize-none"
                  placeholder="Briefly describe what this project is about..."
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-end gap-3 mt-4 pt-6 border-t border-gray-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="rounded-xl px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-zinc-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 shadow-sm"
                >
                  Create Project
                </button>
              </div>
            </form>
          </Dialog>

          {/* Delete Confirmation Modal */}
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

        </main>
      </div>
    </AuthGuard>
  );
}
