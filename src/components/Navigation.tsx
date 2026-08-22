"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export function Navigation() {
  const { user, isLoading, logout } = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Dashboard", href: "/" },
    { name: "Discover", href: "/discover" },
    { name: "Projects", href: "/projects" },
    { name: "Favorites", href: "/favorites" },
    { name: "Compare", href: "/compare" },
  ];

  return (
    <header className="w-full border-b border-gray-100 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link 
          href="/" 
          className="font-bold text-xl text-brand-600 dark:text-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500 rounded px-1 -ml-1 transition-colors"
          aria-label="AI Platform Home"
        >
          AI Platform
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = 
              pathname === link.href || 
              (link.href !== '/' && pathname.startsWith(link.href)) || 
              (link.href === '/discover' && pathname.startsWith('/tools'));
              
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 rounded px-2 py-1 -mx-2 ${
                  isActive
                    ? "text-brand-600 dark:text-brand-400 font-semibold bg-brand-50 dark:bg-brand-900/20"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {link.name}
              </Link>
            );
          })}
          
          {/* Auth Actions */}
          <div className="ml-4 flex items-center gap-3 border-l border-gray-200 dark:border-zinc-800 pl-4">
            {isLoading ? (
              <div className="h-9 w-24 bg-gray-100 dark:bg-zinc-800 rounded animate-pulse"></div>
            ) : user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user.name}
                </span>
                <button
                  onClick={logout}
                  className="text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 rounded px-2 py-1"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 rounded px-2 py-1"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 shadow-sm"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center md:hidden gap-4">
          <button
            type="button"
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 rounded p-1 -mr-1"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-4 space-y-3 shadow-lg">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => {
              const isActive = 
                pathname === link.href || 
                (link.href !== '/' && pathname.startsWith(link.href)) || 
                (link.href === '/discover' && pathname.startsWith('/tools'));
                
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block text-base font-medium rounded-xl px-4 py-3 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                    isActive
                      ? "text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-900"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
          
          <div className="pt-4 mt-2 border-t border-gray-100 dark:border-zinc-800 flex flex-col gap-3 px-2">
            {isLoading ? (
              <div className="h-10 w-full bg-gray-100 dark:bg-zinc-800 rounded-xl animate-pulse"></div>
            ) : user ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 px-2 py-1 mb-2 border-b border-gray-100 dark:border-zinc-800 pb-4">
                  <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-lg">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{user.name}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{user.email}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    logout();
                  }}
                  className="block w-full text-center rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 px-4 py-3 text-sm font-semibold text-red-600 dark:text-red-400 transition-colors hover:bg-red-100 dark:hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-center rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white transition-colors hover:bg-gray-50 dark:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-center rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 shadow-sm"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
