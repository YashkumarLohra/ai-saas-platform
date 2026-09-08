"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import { createClient } from "@/lib/supabase/client";

export interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  signup: (email: string, name: string, password?: string) => Promise<{ sessionCreated: boolean }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { showToast } = useToast();
  // Safe to create inside component as per Supabase SSR docs
  const supabase = createClient();

  useEffect(() => {
    // 1. Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata?.name || session.user.email!.split("@")[0],
          });
        }
      } catch (error) {
        console.error("Failed to load auth session", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // 2. Listen for auth changes (login, logout, token refresh, cross-tab)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata?.name || session.user.email!.split("@")[0],
          });
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const login = async (email: string, password?: string) => {
    if (!password) {
      throw new Error("Password is required");
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error(error);
      throw error;
    }
    
    showToast("Successfully logged in");
  };

  const signup = async (email: string, name: string, password?: string) => {
    if (!password) {
      throw new Error("Password is required");
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        }
      }
    });

    if (error) {
      console.error(error);
      throw error;
    }
    
    return { sessionCreated: !!data.session };
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
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
