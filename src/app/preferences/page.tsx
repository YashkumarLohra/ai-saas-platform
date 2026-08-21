"use client";

import { useState } from "react";
import Link from "next/link";
import { usePreferences } from "@/context/PreferencesContext";
import { MOCK_RECOMMENDATIONS } from "@/data/recommendations";
import { ExperienceLevel } from "@/types/index";

export default function PreferencesPage() {
  const { preferences, savePreferences, clearPreferences } = usePreferences();
  
  // Local state for editing
  const [selectedCategories, setSelectedCategories] = useState<string[]>(preferences.preferredCategories || []);
  const [experience, setExperience] = useState<ExperienceLevel | undefined>(preferences.experienceLevel);
  const [isSaved, setIsSaved] = useState(false);

  // Sync with context on change (e.g. hydration)
  const [prevPreferences, setPrevPreferences] = useState(preferences);
  if (preferences !== prevPreferences) {
    setSelectedCategories(preferences.preferredCategories || []);
    setExperience(preferences.experienceLevel);
    setPrevPreferences(preferences);
  }

  // Extract unique categories from product data
  const availableCategories = Array.from(new Set(MOCK_RECOMMENDATIONS.map(t => t.category))).sort();

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
    setIsSaved(false);
  };

  const handleSave = () => {
    savePreferences({
      preferredCategories: selectedCategories,
      experienceLevel: experience,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleClear = () => {
    clearPreferences();
    setIsSaved(false);
  };

  return (
    <div className="flex min-h-screen flex-col p-6 sm:p-12 md:p-20 bg-gray-50 dark:bg-zinc-950">
      <main className="w-full max-w-3xl mx-auto flex flex-col gap-8">
        
        {/* Header */}
        <div className="flex flex-col gap-4">
          <nav className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-brand-600 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 rounded px-1 -ml-1">
              Home
            </Link>
            <svg className="mx-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 dark:text-gray-100 font-semibold" aria-current="page">Preferences</span>
          </nav>
          
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
            Personalize your experience
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl">
            Tell us what you&apos;re interested in to help us recommend the best AI tools for you.
          </p>
        </div>

        {/* Preferences Form */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-sm flex flex-col gap-10">
          
          {/* Categories */}
          <section className="flex flex-col gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Topics of Interest</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Select the AI categories you want to see more of.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {availableCategories.map(cat => {
                const isSelected = selectedCategories.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${
                      isSelected 
                        ? "bg-brand-600 text-white shadow-sm border border-transparent" 
                        : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100 dark:bg-zinc-800/50 dark:text-gray-300 dark:border-zinc-700 dark:hover:bg-zinc-800"
                    }`}
                    aria-pressed={isSelected}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Experience Level */}
          <section className="flex flex-col gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Experience Level</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                How familiar are you with AI tools? (Optional)
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(["beginner", "intermediate", "advanced"] as ExperienceLevel[]).map(level => {
                const isSelected = experience === level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => {
                      setExperience(isSelected ? undefined : level);
                      setIsSaved(false);
                    }}
                    className={`flex flex-col p-4 rounded-2xl border text-left transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                      isSelected 
                        ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20 shadow-sm" 
                        : "border-gray-200 bg-white hover:border-gray-300 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600"
                    }`}
                    aria-pressed={isSelected}
                  >
                    <span className={`font-semibold capitalize ${isSelected ? "text-brand-700 dark:text-brand-400" : "text-gray-900 dark:text-white"}`}>
                      {level}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {level === "beginner" && "Just starting out"}
                      {level === "intermediate" && "Comfortable using AI"}
                      {level === "advanced" && "Power user / Developer"}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Actions */}
          <div className="pt-8 border-t border-gray-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={handleClear}
              className="text-sm font-semibold text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 rounded px-3 py-2 -ml-3"
            >
              Reset to default
            </button>
            
            <button
              onClick={handleSave}
              className={`w-full sm:w-auto rounded-xl px-8 py-3.5 text-sm font-semibold text-white transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 shadow-sm ${
                isSaved 
                  ? "bg-green-600 hover:bg-green-500" 
                  : "bg-brand-600 hover:bg-brand-500"
              }`}
            >
              {isSaved ? (
                <span className="flex items-center gap-2 justify-center">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Saved
                </span>
              ) : (
                "Save Preferences"
              )}
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}
