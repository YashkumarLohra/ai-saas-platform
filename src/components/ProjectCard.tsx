import { Project } from "@/types/index";
import Link from "next/link";

interface ProjectCardProps {
  project: Project;
  onDelete: (project: Project) => void;
}

export function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const formattedDate = new Date(project.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="flex flex-col h-full rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 transition-all hover:shadow-md relative group">
      
      <div className="flex-1">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-1">
              {project.name}
            </h3>
            <p className="mt-1 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              Created {formattedDate}
            </p>
          </div>
          <button
            onClick={() => onDelete(project)}
            className="shrink-0 p-2 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 opacity-0 group-hover:opacity-100 focus:opacity-100 sm:opacity-100"
            aria-label={`Delete project ${project.name}`}
            title="Delete Project"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-8 line-clamp-3 leading-relaxed">
          {project.description || "No description provided."}
        </p>
      </div>

      <div className="mt-auto">
        <Link 
          href={`/projects/${project.id}`}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-gray-50 dark:bg-zinc-800 px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white transition-colors hover:bg-gray-100 dark:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          Open Project
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
