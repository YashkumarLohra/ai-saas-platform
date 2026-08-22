"use client";

import { useState } from "react";
import { RecommendationResults } from "@/components/RecommendationResults";
import { TaskContext } from "@/types/index";

interface TaskInputProps {
  onTaskResolved?: (context: TaskContext | null) => void;
  searchQuery?: string;
  onSearchQueryChange?: (query: string) => void;
  mode?: "search" | "task";
}

export function TaskInput({ onTaskResolved, searchQuery, onSearchQueryChange, mode = "task" }: TaskInputProps = {}) {
  const [internalTask, setInternalTask] = useState("");
  const task = searchQuery !== undefined ? searchQuery : internalTask;
  
  const handleTaskChange = (val: string) => {
    if (searchQuery === undefined) {
      setInternalTask(val);
    }
    onSearchQueryChange?.(val);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [taskContext, setTaskContext] = useState<TaskContext | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTask = task.trim();
    if (!trimmedTask) return;

    if (mode === "search") {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      return;
    }

    setIsSubmitting(true);
    
    // Simulate network request or processing delay for UX
    setTimeout(() => {
      setIsSubmitting(false);
      const newContext = { query: trimmedTask };
      setTaskContext(newContext);
      onTaskResolved?.(newContext);
    }, 1200);
  };

  const handleEditTask = () => {
    setTaskContext(null);
    onTaskResolved?.(null);
  };

  const handleClear = () => {
    handleTaskChange("");
  };

  if (taskContext) {
    return (
      <div className="w-full min-h-[60px] flex flex-col justify-start">
        <RecommendationResults 
          context={taskContext} 
          onEditTask={handleEditTask} 
        />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center gap-8 animate-in fade-in slide-in-from-top-4 duration-500">
      <form 
        onSubmit={handleSubmit}
        className="flex w-full max-w-xl items-center gap-2 rounded-full border border-gray-200 bg-white p-2 shadow-sm dark:border-gray-800 dark:bg-zinc-900 transition-shadow focus-within:ring-2 focus-within:ring-brand-500"
      >
        <div className="relative flex-1 flex items-center">
          <input 
            type="text" 
            value={task}
            onChange={(e) => handleTaskChange(e.target.value)}
            placeholder={mode === "search" ? "Search AI tools..." : "Search AI tools or describe a task..."}
            className="w-full bg-transparent px-4 py-2 pr-10 outline-none text-gray-900 dark:text-white"
            disabled={isSubmitting}
            maxLength={300}
            aria-label={mode === "search" ? "Search AI tools" : "What are you trying to accomplish?"}
          />
          {task.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2 p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 rounded-full"
              aria-label="Clear search"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <button 
          type="submit"
          disabled={isSubmitting || !task.trim()}
          className="rounded-full bg-brand-600 px-6 py-2 font-medium text-white transition-colors hover:bg-brand-500 disabled:opacity-50 flex items-center justify-center min-w-[110px] focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2" aria-label="Loading">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
          ) : (
            mode === "search" ? "Search" : "Discover"
          )}
        </button>
      </form>
      
      {mode === "task" && (
        <div className="w-full min-h-[60px] flex flex-col justify-start">
          <p className="text-sm text-center text-gray-500 dark:text-gray-400 py-2">
            Discover the perfect AI tools for your next project.
          </p>
        </div>
      )}
    </div>
  );
}
