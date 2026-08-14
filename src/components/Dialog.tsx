"use client";

import { useEffect, useRef, ReactNode } from "react";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  description?: string;
}

export function Dialog({ isOpen, onClose, title, children, description }: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Trap focus (simple version: just focus the dialog on open)
  useEffect(() => {
    if (isOpen && dialogRef.current) {
      dialogRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Dialog Panel */}
      <div 
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby={description ? "dialog-description" : undefined}
        className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-2xl border border-gray-100 dark:border-zinc-800 animate-in zoom-in-95 duration-200 outline-none flex flex-col max-h-[90vh]"
      >
        <div className="mb-6">
          <h2 id="dialog-title" className="text-2xl font-bold text-gray-900 dark:text-white">
            {title}
          </h2>
          {description && (
            <p id="dialog-description" className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
        
        <div className="overflow-y-auto flex-1">
          {children}
        </div>
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-zinc-800 dark:hover:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
          aria-label="Close dialog"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
