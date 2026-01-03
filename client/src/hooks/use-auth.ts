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
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  // Transform Supabase user to match your existing User interface
  return {
    id: user.id,
    email: user.email || '',
    firstName: user.user_metadata?.firstName || 'Anonymous',
    lastName: user.user_metadata?.lastName || 'User',
    profileImageUrl: user.user_metadata?.avatar_url || null,
    is_anonymous: user.is_anonymous || false,
  } as SupabaseUser;
}

async function logout(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Supabase logout error:", error);
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        throw new Error(error.message);
      }

      // Transform Supabase user to match your interface
      return {
        id: data.user!.id,
        email: data.user!.email || '',
        firstName: data.user!.user_metadata?.firstName || 'User',
        lastName: data.user!.user_metadata?.lastName || '',
        profileImageUrl: data.user!.user_metadata?.avatar_url || null,
        is_anonymous: false,
      };
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["supabase-auth"], user);
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (userData: { email: string; password: string; firstName: string; lastName?: string }) => {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            firstName: userData.firstName,
            lastName: userData.lastName || '',
          },
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      // For Supabase, user might need email confirmation
      if (!data.user) {
        throw new Error("Registration failed - please check your email for confirmation");
      }

      return {
        id: data.user.id,
        email: data.user.email || '',
        firstName: userData.firstName,
        lastName: userData.lastName || '',
        profileImageUrl: null,
        is_anonymous: false,
      };
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["supabase-auth"], user);
    },
  });

  const oauthLoginMutation = useMutation({
    mutationFn: async (provider: 'google' | 'github' | 'discord') => {
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
      const { data, error } = await supabase.auth.signInAnonymously();

      if (error) {
        throw new Error(error.message);
      }

      if (!data.user) {
        throw new Error("Anonymous login failed");
      }

      console.log("Anonymous session created with Supabase");

      return {
        id: data.user.id,
        email: '',
        firstName: 'Anonymous',
        lastName: 'User',
        profileImageUrl: null,
        is_anonymous: true,
      };
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["supabase-auth"], user);
    },
  });

  const convertAnonymousMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      // 1. Update user with email (this sends verification email)
      const { data: updateData, error: updateError } = await supabase.auth.updateUser({
        email: credentials.email,
      });

      if (updateError) {
        throw new Error(`Failed to update email: ${updateError.message}`);
      }

      // 2. Note: User needs to verify email before setting password
      // In a real app, you'd want to handle email verification flow
      console.log('Email update initiated. User needs to verify email before setting password.');

      return { success: true, message: 'Check your email to verify and complete account setup.' };
    },
  });

  const linkOAuthMutation = useMutation({
    mutationFn: async (provider: 'google' | 'github' | 'discord') => {
      const { data, error } = await supabase.auth.linkIdentity({
        provider: provider
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
