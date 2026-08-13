"use client";

import { useState } from "react";

export function TaskInput() {
  const [task, setTask] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTask, setSubmittedTask] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTask = task.trim();
    if (!trimmedTask) return;

    setIsSubmitting(true);
    
    // Simulate network request or processing delay for UX
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedTask(trimmedTask);
      setTask("");
    }, 800);
  };

  return (
    <div className="w-full max-w-xl flex flex-col gap-3">
      <form 
        onSubmit={handleSubmit}
        className="flex w-full items-center gap-2 rounded-full border border-gray-200 bg-white p-2 shadow-sm dark:border-gray-800 dark:bg-zinc-900 transition-shadow focus-within:ring-2 focus-within:ring-brand-500"
      >
        <input 
          type="text" 
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="e.g. 'I need to generate a marketing video from a script...'" 
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
      
      <div className="min-h-[60px] flex flex-col justify-start">
        {submittedTask ? (
          <div className="rounded-xl border border-brand-200 bg-brand-50 p-4 text-sm text-brand-800 dark:border-brand-900/50 dark:bg-brand-900/20 dark:text-brand-300 animate-in fade-in slide-in-from-bottom-2 text-left">
            <p className="font-medium mb-1">Task received!</p>
            <p className="text-brand-700/90 dark:text-brand-400/90 break-words">We&apos;re analyzing: &quot;{submittedTask}&quot;</p>
            <p className="mt-2 text-xs opacity-80">AI recommendations will be implemented in the next milestone.</p>
          </div>
        ) : (
          <p className="text-sm text-center text-gray-500 dark:text-gray-500 py-2">
            Search functionality is coming in a future milestone.
          </p>
        )}
      </div>
    </div>
  );
}
