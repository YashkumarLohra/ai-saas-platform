"use client";

import { useState } from "react";
import { RecommendationResults } from "@/components/RecommendationResults";
import { TaskContext } from "@/types/index";

export function TaskInput() {
  const [task, setTask] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [taskContext, setTaskContext] = useState<TaskContext | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTask = task.trim();
    if (!trimmedTask) return;

    setIsSubmitting(true);
    
    // Simulate network request or processing delay for UX
    setTimeout(() => {
      setIsSubmitting(false);
      setTaskContext({ query: trimmedTask });
    }, 1200);
  };

  const handleEditTask = () => {
    setTaskContext(null);
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
        <input 
          type="text" 
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="e.g. 'I want to create a professional presentation for college'" 
          className="flex-1 bg-transparent px-4 py-2 outline-none text-foreground"
          disabled={isSubmitting}
          aria-label="Describe your task"
        />
        <button 
          type="submit"
          disabled={isSubmitting || !task.trim()}
          className="rounded-full bg-brand-600 px-6 py-2 font-medium text-white transition-colors hover:bg-brand-500 disabled:opacity-50 flex items-center justify-center min-w-[110px]"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2" aria-label="Loading">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
          ) : (
            "Discover"
          )}
        </button>
      </form>
      
      <div className="w-full min-h-[60px] flex flex-col justify-start">
        <p className="text-sm text-center text-gray-500 dark:text-gray-500 py-2">
          Search functionality is coming in a future milestone.
        </p>
      </div>
    </div>
  );
}
