"use client";

import { useState } from "react";
import { useProjects } from "@/context/ProjectsContext";
import { Dialog } from "@/components/Dialog";
import Link from "next/link";

interface AddToProjectButtonProps {
  slug: string;
  toolName: string;
}

export function AddToProjectButton({ slug, toolName }: AddToProjectButtonProps) {
  const { projects, addToolToProject } = useProjects();
  const [isOpen, setIsOpen] = useState(false);

  const handleAddToProject = (projectId: string) => {
    addToolToProject(projectId, slug);
    setIsOpen(false);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        aria-label={`Add ${toolName} to a project`}
        className="flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 bg-white text-gray-700 hover:bg-gray-50 dark:bg-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-700 border border-gray-200 dark:border-zinc-700 shadow-sm"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Add to Project
      </button>

      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Add to Project"
        description={`Select a project to add ${toolName} to.`}
      >
        <div className="mt-4 flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-2">
          {projects.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">You don&apos;t have any projects yet.</p>
              <Link
                href="/projects"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center justify-center rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-500 shadow-sm"
              >
                Create Project
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {projects.map((project) => {
                const isAdded = project.toolIds?.includes(slug);
                return (
                  <button
                    key={project.id}
                    onClick={() => !isAdded && handleAddToProject(project.id)}
                    disabled={isAdded}
                    className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all ${
                      isAdded 
                        ? "border-gray-200 bg-gray-50 dark:border-zinc-800 dark:bg-zinc-900/50 cursor-not-allowed opacity-75" 
                        : "border-gray-200 bg-white hover:border-brand-500 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-brand-500"
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900 dark:text-white line-clamp-1">{project.name}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {project.toolIds ? project.toolIds.length : 0} {project.toolIds?.length === 1 ? 'tool' : 'tools'}
                      </span>
                    </div>
                    {isAdded ? (
                      <span className="text-xs font-semibold text-green-600 dark:text-green-500 flex items-center gap-1 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        Added
                      </span>
                    ) : (
                      <span className="text-sm font-medium text-brand-600 dark:text-brand-400">Select</span>
                    )}
                  </button>
                );
              })}
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-zinc-800 text-center">
                <Link
                  href="/projects"
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400 dark:hover:text-brand-300"
                >
                  Manage Projects
                </Link>
              </div>
            </div>
          )}
        </div>
      </Dialog>
    </>
  );
}
