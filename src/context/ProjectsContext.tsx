"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Project } from "@/types/index";
import { useToast } from "./ToastContext";
import { useAuth } from "./AuthContext";
import { apiClient } from "@/lib/api-client";

interface ProjectsContextType {
  projects: Project[];
  isLoadingProjects: boolean;
  createProject: (name: string, description?: string) => void;
  deleteProject: (id: string) => void;
  renameProject: (id: string, newName: string) => void;
  addToolToProject: (projectId: string, toolSlug: string) => void;
  removeToolFromProject: (projectId: string, toolSlug: string) => void;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [mutatingProjects, setMutatingProjects] = useState<Set<string>>(new Set());
  
  const { showToast } = useToast();
  const { user } = useAuth();
  
  // Load from backend on mount and when user changes
  useEffect(() => {
    let isMounted = true;

    async function loadProjects() {
      if (!user) {
        if (isMounted) {
          setProjects([]);
          setIsLoadingProjects(false);
        }
        return;
      }

      try {
        setIsLoadingProjects(true);
        const res = (await apiClient.get('/projects')) as { success: boolean; data: Project[] };
        if (isMounted && res.success) {
          setProjects(res.data || []);
        }
      } catch (error) {
        console.error("Failed to load projects:", error);
        if (isMounted) {
          showToast("Failed to load your projects.");
        }
      } finally {
        if (isMounted) {
          setIsLoadingProjects(false);
        }
      }
    }

    loadProjects();

    return () => {
      isMounted = false;
    };
  }, [user, showToast]);

  const createProject = async (name: string, description?: string) => {
    if (!user) {
      showToast("Please log in to create projects.");
      return;
    }
    
    // Prevent duplicate simultaneous creates with the same name
    const creationKey = `CREATE_${name}`;
    if (mutatingProjects.has(creationKey)) return;
    setMutatingProjects(prev => new Set(prev).add(creationKey));

    try {
      const res = (await apiClient.post('/projects', { 
        name: name.trim(), 
        description: description?.trim() || null 
      })) as { success: boolean; data: Project };
      
      if (res.success && res.data) {
        setProjects(prev => [res.data, ...prev]);
        showToast("Project created");
      }
    } catch (error) {
      console.error("Failed to create project:", error);
      showToast("Failed to create project. Please try again.");
    } finally {
      setMutatingProjects(prev => {
        const next = new Set(prev);
        next.delete(creationKey);
        return next;
      });
    }
  };

  const deleteProject = async (id: string) => {
    if (!user || mutatingProjects.has(id)) return;
    setMutatingProjects(prev => new Set(prev).add(id));

    // Optimistic UI update
    const previousProjects = [...projects];
    setProjects(prev => prev.filter(p => p.id !== id));

    try {
      await apiClient.delete(`/projects/${id}`);
      showToast("Project deleted");
    } catch (error) {
      console.error("Failed to delete project:", error);
      setProjects(previousProjects); // Rollback
      showToast("Failed to delete project. Please try again.");
    } finally {
      setMutatingProjects(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const renameProject = async (id: string, newName: string) => {
    if (!user || mutatingProjects.has(id)) return;
    setMutatingProjects(prev => new Set(prev).add(id));

    const previousProjects = [...projects];
    
    // Optimistic update
    setProjects(prev => prev.map(p => 
      p.id === id ? { ...p, name: newName.trim(), updatedAt: new Date().toISOString() } : p
    ));

    try {
      const res = (await apiClient.patch(`/projects/${id}`, { name: newName.trim() })) as { success: boolean; data: Project };
      if (res.success && res.data) {
        // Replace with true server data
        setProjects(prev => prev.map(p => p.id === id ? { ...p, ...res.data } : p));
        showToast("Project renamed");
      }
    } catch (error) {
      console.error("Failed to rename project:", error);
      setProjects(previousProjects);
      showToast("Failed to rename project.");
    } finally {
      setMutatingProjects(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const addToolToProject = async (projectId: string, toolSlug: string) => {
    if (!user) return;
    const mutationKey = `${projectId}_ADD_${toolSlug}`;
    if (mutatingProjects.has(mutationKey)) return;
    setMutatingProjects(prev => new Set(prev).add(mutationKey));

    const previousProjects = [...projects];

    // Optimistic update
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const currentTools = p.toolIds || [];
        if (!currentTools.includes(toolSlug)) {
          return { ...p, toolIds: [...currentTools, toolSlug] };
        }
      }
      return p;
    }));

    try {
      await apiClient.post(`/projects/${projectId}/tools`, { slug: toolSlug });
      showToast("Added to Project");
    } catch (error) {
      console.error("Failed to add tool to project:", error);
      setProjects(previousProjects);
      showToast("Failed to add to project.");
    } finally {
      setMutatingProjects(prev => {
        const next = new Set(prev);
        next.delete(mutationKey);
        return next;
      });
    }
  };

  const removeToolFromProject = async (projectId: string, toolSlug: string) => {
    if (!user) return;
    const mutationKey = `${projectId}_REM_${toolSlug}`;
    if (mutatingProjects.has(mutationKey)) return;
    setMutatingProjects(prev => new Set(prev).add(mutationKey));

    const previousProjects = [...projects];

    // Optimistic update
    setProjects(prev => prev.map(p => {
      if (p.id === projectId && p.toolIds) {
        return { ...p, toolIds: p.toolIds.filter(t => t !== toolSlug) };
      }
      return p;
    }));

    try {
      await apiClient.delete(`/projects/${projectId}/tools/${toolSlug}`);
      showToast("Removed from Project");
    } catch (error) {
      console.error("Failed to remove tool from project:", error);
      setProjects(previousProjects);
      showToast("Failed to remove tool.");
    } finally {
      setMutatingProjects(prev => {
        const next = new Set(prev);
        next.delete(mutationKey);
        return next;
      });
    }
  };

  return (
    <ProjectsContext.Provider value={{ 
      projects, 
      isLoadingProjects,
      createProject, 
      deleteProject, 
      renameProject, 
      addToolToProject, 
      removeToolFromProject 
    }}>
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
