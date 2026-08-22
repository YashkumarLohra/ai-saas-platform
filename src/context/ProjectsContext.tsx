"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Project } from "@/types/index";
import { useToast } from "./ToastContext";
import { useAuth } from "./AuthContext";
import { projectsRepository } from "@/services/storage";

interface ProjectsContextType {
  projects: Project[];
  createProject: (name: string, description?: string) => void;
  deleteProject: (id: string) => void;
  renameProject: (id: string, newName: string) => void;
  addToolToProject: (projectId: string, toolSlug: string) => void;
  removeToolFromProject: (projectId: string, toolSlug: string) => void;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

/**
 * TODO (Authentication Readiness):
 * Projects are currently managed via the projectsRepository (backed by localStorage).
 * When real authentication is introduced, simply swap the projectsRepository implementation
 * in `src/services/storage.ts` to use a backend API.
 */

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const { showToast } = useToast();
  const { user } = useAuth();
  
  // Load from storage on mount and when user changes
  useEffect(() => {
    setProjects(projectsRepository.get(user?.id || null));
  }, [user]);

  // Sync state changes across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      const expectedKey = projectsRepository.getKey(user?.id || null);
      if (e.key === expectedKey && e.newValue) {
        try {
          setProjects(JSON.parse(e.newValue));
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [user]);

  const createProject = (name: string, description?: string) => {
    setProjects((prev) => {
      const now = new Date().toISOString();
      const newProject: Project = {
        id: `project-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        name: name.trim(),
        description: description?.trim(),
        toolIds: [],
        createdAt: now,
        updatedAt: now,
      };
      
      const newProjects = [newProject, ...prev];
      try {
        projectsRepository.set(user?.id || null, newProjects);
        showToast("Project created");
      } catch (error) {
        console.error("Failed to save project to localStorage:", error);
        showToast("Something went wrong. Please try again.");
      }
      return newProjects;
    });
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => {
      const newProjects = prev.filter((p) => p.id !== id);
      try {
        projectsRepository.set(user?.id || null, newProjects);
        showToast("Project deleted");
      } catch (error) {
        console.error("Failed to update projects in localStorage:", error);
        showToast("Something went wrong. Please try again.");
      }
      return newProjects;
    });
  };

  const renameProject = (id: string, newName: string) => {
    setProjects((prev) => {
      const newProjects = prev.map((p) => {
        if (p.id === id) {
          return { ...p, name: newName.trim(), updatedAt: new Date().toISOString() };
        }
        return p;
      });
      try {
        projectsRepository.set(user?.id || null, newProjects);
        showToast("Project renamed");
      } catch (error) {
        console.error("Failed to update projects in localStorage:", error);
        showToast("Something went wrong. Please try again.");
      }
      return newProjects;
    });
  };

  const addToolToProject = (projectId: string, toolSlug: string) => {
    setProjects((prev) => {
      const newProjects = prev.map((p) => {
        if (p.id === projectId) {
          const currentTools = p.toolIds || [];
          if (!currentTools.includes(toolSlug)) {
            return {
              ...p,
              toolIds: [...currentTools, toolSlug],
              updatedAt: new Date().toISOString(),
            };
          }
        }
        return p;
      });
      try {
        projectsRepository.set(user?.id || null, newProjects);
        showToast("Added to Project");
      } catch (error) {
        console.error("Failed to update projects in localStorage:", error);
        showToast("Something went wrong. Please try again.");
      }
      return newProjects;
    });
  };

  const removeToolFromProject = (projectId: string, toolSlug: string) => {
    setProjects((prev) => {
      const newProjects = prev.map((p) => {
        if (p.id === projectId && p.toolIds) {
          return {
            ...p,
            toolIds: p.toolIds.filter((t) => t !== toolSlug),
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      });
      try {
        projectsRepository.set(user?.id || null, newProjects);
        showToast("Removed from Project");
      } catch (error) {
        console.error("Failed to update projects in localStorage:", error);
        showToast("Something went wrong. Please try again.");
      }
      return newProjects;
    });
  };

  return (
    <ProjectsContext.Provider value={{ projects, createProject, deleteProject, renameProject, addToolToProject, removeToolFromProject }}>
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
