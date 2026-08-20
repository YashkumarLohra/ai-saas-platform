"use client";

import { useState, useEffect } from "react";

interface FeedbackWidgetProps {
  toolId: string;
  taskQuery?: string;
}

export function FeedbackWidget({ toolId, taskQuery }: FeedbackWidgetProps) {
  // Unique storage key based on tool and context
  const storageKey = `feedback_${toolId}_${taskQuery || 'none'}`;
  const [isMounted, setIsMounted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showReason, setShowReason] = useState(false);
  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  const isActuallySubmitted = submitted || (isMounted && typeof window !== "undefined" ? !!localStorage.getItem(storageKey) : false);

  const saveFeedback = (helpful: boolean, selectedReason?: string, userComment?: string) => {
    if (typeof window !== "undefined") {
      const data = {
        toolId,
        taskQuery,
        helpful,
        reason: selectedReason,
        comment: userComment,
        timestamp: new Date().toISOString()
      };
      
      try {
        localStorage.setItem(storageKey, JSON.stringify(data));
      } catch (error) {
        console.error("Failed to save feedback", error);
        // We still mark it as submitted in state so the UI updates
      }
      
      setSubmitted(true);
      setShowReason(false);
    }
  };

  const handleHelpful = (helpful: boolean) => {
    if (helpful) {
      saveFeedback(true);
    } else {
      setShowReason(true);
    }
  };

  const handleReasonSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveFeedback(false, reason, comment);
  };

  if (isActuallySubmitted) {
    return (
      <div className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2 shadow-sm">
        <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        {submitted && !reason ? "Thanks for your feedback!" : "Thanks for helping us improve!"}
      </div>
    );
  }

  if (showReason) {
    return (
      <form onSubmit={handleReasonSubmit} className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 flex flex-col gap-3 animate-in fade-in duration-300 shadow-sm">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Why wasn&apos;t it helpful?
        </p>
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
          className="w-full text-sm rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900 outline-none focus:ring-2 focus:ring-brand-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
          aria-label="Reason for negative feedback"
        >
          <option value="" disabled>Select a reason...</option>
          <option value="not-relevant">Not relevant to my task</option>
          <option value="wrong-type">Wrong type of tool</option>
          <option value="too-expensive">Too expensive</option>
          <option value="not-expected">Not what I expected</option>
          <option value="other">Other</option>
        </select>
        
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Optional comment (max 100 chars)"
          className="w-full text-sm rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900 outline-none focus:ring-2 focus:ring-brand-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
          aria-label="Optional feedback comment"
          maxLength={100}
        />
        
        <div className="flex justify-end gap-2 mt-1">
          <button
            type="button"
            onClick={() => setShowReason(false)}
            className="px-3 py-1.5 text-xs font-semibold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-1.5 text-xs font-semibold bg-gray-900 text-white dark:bg-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors shadow-sm"
          >
            Submit
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3 flex items-center justify-between gap-4 shadow-sm">
      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
        Was this recommendation helpful?
      </span>
      <div className="flex gap-2">
        <button
          onClick={() => handleHelpful(true)}
          className="px-4 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
          aria-label="Yes, this recommendation was helpful"
        >
          Yes
        </button>
        <button
          onClick={() => handleHelpful(false)}
          className="px-4 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
          aria-label="No, this recommendation was not helpful"
        >
          No
        </button>
      </div>
    </div>
  );
}
