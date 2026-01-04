import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

// Supabase user type (compatible with your existing User interface)
type SupabaseUser = User & {
  user_metadata?: {
    firstName?: string;
    lastName?: string;
  };
  is_anonymous?: boolean;
};

async function fetchUser(): Promise<SupabaseUser | null> {
  // First check if we have a backend JWT token
  const token = localStorage.getItem("auth_token");

  if (token) {
    // Try to get user from backend API
    const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
    try {
      const response = await fetch(`${API_BASE}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const user = await response.json();
        return {
          id: user.id,
          email: user.email || "",
          firstName: user.firstName || "Anonymous",
          lastName: user.lastName || "User",
          profileImageUrl: user.profileImageUrl || null,
          is_anonymous: false,
          app_metadata: {},
          user_metadata: { firstName: user.firstName, lastName: user.lastName },
          aud: "authenticated",
          created_at: new Date().toISOString(),
        } as unknown as SupabaseUser;
      } else {
        // Token is invalid, remove it
        localStorage.removeItem("auth_token");
      }
    } catch (error) {
      console.error("Failed to fetch user from backend:", error);
      // Fall through to Supabase check
    }
  }

  // Fallback to Supabase auth if backend token doesn't exist
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  // Transform Supabase user to match your existing User interface
  return user as SupabaseUser;
}

async function logout(): Promise<void> {
  // Call backend logout endpoint
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const token = localStorage.getItem("auth_token");

  if (token) {
    try {
      await fetch(`${API_BASE}/api/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Backend logout error:", error);
    }
  }

  // Remove token from localStorage
  localStorage.removeItem("auth_token");

  // Also logout from Supabase if needed (optional)
  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.warn("Supabase logout error:", error);
  }

  // Force page reload to clear all state
  window.location.reload();
}

export function useAuth() {
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useQuery<SupabaseUser | null>({
    queryKey: ["supabase-auth"],
    queryFn: fetchUser,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      // Call backend API for authentication
      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
      }

      const { token, user } = await response.json();

      // Store JWT token in localStorage for API calls
      localStorage.setItem("auth_token", token);

      // Also sync with Supabase if needed (optional)
      try {
        await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });
      } catch (supabaseError) {
        // Supabase auth is optional, don't fail if it errors
        console.warn("Supabase auth sync failed:", supabaseError);
      }

      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName || "User",
        lastName: user.lastName || "",
        profileImageUrl: user.profileImageUrl || null,
        is_anonymous: false,
        app_metadata: {},
        user_metadata: { firstName: user.firstName, lastName: user.lastName },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as unknown as SupabaseUser;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["supabase-auth"], user);
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (userData: {
      email: string;
      password: string;
      firstName: string;
      lastName?: string;
    }) => {
      // Call backend API for registration
      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
          firstName: userData.firstName,
          lastName: userData.lastName,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Registration failed");
      }

      const { token, user } = await response.json();

      // Store JWT token in localStorage for API calls
      localStorage.setItem("auth_token", token);

      // Also sync with Supabase if needed (optional)
      try {
        await supabase.auth.signUp({
          email: userData.email,
          password: userData.password,
          options: {
            data: {
              firstName: userData.firstName,
              lastName: userData.lastName || "",
            },
          },
        });
      } catch (supabaseError) {
        // Supabase auth is optional, don't fail if it errors
        console.warn("Supabase auth sync failed:", supabaseError);
      }

      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName || "",
        profileImageUrl: user.profileImageUrl || null,
        is_anonymous: false,
      };
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["supabase-auth"], user);
    },
  });

  const oauthLoginMutation = useMutation({
    mutationFn: async (provider: "google" | "github" | "discord") => {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      // OAuth will redirect, so we don't return user data here
      return data;
    },
  });

  const anonymousLoginMutation = useMutation({
    mutationFn: async () => {
      // Call backend API for anonymous authentication
      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await fetch(`${API_BASE}/api/auth/anonymous`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Anonymous login failed");
      }

      const { token, user } = await response.json();

      // Store JWT token in localStorage for API calls
      localStorage.setItem("auth_token", token);

      console.log("Anonymous session created with backend, token stored");

      return {
        id: user.id,
        email: user.email || "",
        firstName: user.firstName || "Anonymous",
        lastName: user.lastName || "User",
        profileImageUrl: user.profileImageUrl || null,
        is_anonymous: true,
        app_metadata: {},
        user_metadata: { firstName: user.firstName, lastName: user.lastName },
        aud: "authenticated",
        created_at: new Date().toISOString(),
      } as unknown as SupabaseUser;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["supabase-auth"], user);
    },
  });

  const convertAnonymousMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      // 1. Update user with email (this sends verification email)
      const { data: updateData, error: updateError } =
        await supabase.auth.updateUser({
          email: credentials.email,
        });

      if (updateError) {
        throw new Error(`Failed to update email: ${updateError.message}`);
      }

      // 2. Note: User needs to verify email before setting password
      // In a real app, you'd want to handle email verification flow
      console.log(
        "Email update initiated. User needs to verify email before setting password."
      );

      return {
        success: true,
        message: "Check your email to verify and complete account setup.",
      };
    },
  });

  const linkOAuthMutation = useMutation({
    mutationFn: async (provider: "google" | "github" | "discord") => {
      const { data, error } = await supabase.auth.linkIdentity({
        provider: provider,
      });

      if (error) {
        throw new Error(`Failed to link ${provider}: ${error.message}`);
      }

      return data;
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(["supabase-auth"], null);
    },
  });

  // Check if current user is anonymous
  const isAnonymous = user && user.is_anonymous;

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAnonymous,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    loginAnonymously: anonymousLoginMutation.mutateAsync,
    loginWithOAuth: oauthLoginMutation.mutateAsync,
    convertAnonymous: convertAnonymousMutation.mutateAsync,
    linkOAuth: linkOAuthMutation.mutateAsync,
    logout: logoutMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingInAnonymously: anonymousLoginMutation.isPending,
    isLoggingInWithOAuth: oauthLoginMutation.isPending,
    isConvertingAnonymous: convertAnonymousMutation.isPending,
    isLinkingOAuth: linkOAuthMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
}
