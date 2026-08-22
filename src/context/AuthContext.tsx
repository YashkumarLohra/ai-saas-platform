"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";

export interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string) => Promise<void>;
  signup: (email: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "ai_saas_auth_session";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    // Initialize session from local storage
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load auth session", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sync auth state across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === LOCAL_STORAGE_KEY) {
        if (e.newValue) {
          try {
            setUser(JSON.parse(e.newValue));
          } catch {
            // ignore
          }
        } else {
          setUser(null);
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const login = async (email: string) => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    // In a real app, this would come from the backend. 
    // Here we use a deterministic ID based on email to maintain "ownership" across logins for testing.
    const mockUser: User = {
      id: `user_${btoa(email).replace(/[^a-zA-Z0-9]/g, "").slice(0, 8)}`,
      email,
      name: email.split("@")[0],
    };
    
    setUser(mockUser);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mockUser));
      showToast("Successfully logged in");
    } catch (err) {
      console.error(err);
    }
  };

  const signup = async (email: string, name: string) => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const mockUser: User = {
      id: `user_${btoa(email).replace(/[^a-zA-Z0-9]/g, "").slice(0, 8)}`,
      email,
      name,
    };
    
    setUser(mockUser);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mockUser));
      showToast("Account created successfully");
    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      showToast("Successfully logged out");
      router.push("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
