"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Project } from "@/types/index";

interface ProjectsContextType {
  projects: Project[];
  createProject: (name: string, description?: string) => void;
  deleteProject: (id: string) => void;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "ai_saas_projects";

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (isInitialized) return;
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        // eslint-disable-next-line
        setProjects(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load projects from localStorage:", error);
    }
    setIsInitialized(true);
  }, [isInitialized]);

  // Sync state changes across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === LOCAL_STORAGE_KEY && e.newValue) {
        try {
          setProjects(JSON.parse(e.newValue));
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const createProject = (name: string, description?: string) => {
    setProjects((prev) => {
      const now = new Date().toISOString();
      const newProject: Project = {
        id: `project-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        name: name.trim(),
        description: description?.trim(),
        createdAt: now,
        updatedAt: now,
      };
      
      const newProjects = [newProject, ...prev];
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newProjects));
      } catch (error) {
        console.error("Failed to save project to localStorage:", error);
      }
      return newProjects;
    });
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => {
      const newProjects = prev.filter((p) => p.id !== id);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newProjects));
      } catch (error) {
        console.error("Failed to update projects in localStorage:", error);
      }
      return newProjects;
    });
  };

  return (
    <ProjectsContext.Provider value={{ projects, createProject, deleteProject }}>
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectsContext);
  if (context === undefined) {
    throw new Error("useProjects must be used within a ProjectsProvider");
  }
  return context;
}
