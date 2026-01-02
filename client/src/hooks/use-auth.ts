import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { User } from "@shared/models/auth";

async function fetchUser(): Promise<User | null> {
  const token = localStorage.getItem('auth_token');
  if (!token) return null;

  const response = await fetch("/api/auth/me", {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    localStorage.removeItem('auth_token');
    return null;
  }

  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }

  return response.json();
}

async function logout(): Promise<void> {
  try {
    const token = localStorage.getItem('auth_token');
    if (token) {
      // Call logout endpoint to deactivate anonymous sessions
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    }
  } catch (error) {
    console.error("Logout API call failed:", error);
    // Continue with local logout even if API call fails
  }

  localStorage.removeItem('auth_token');
  window.location.reload();
}

export function useAuth() {
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ["/api/auth/me"],
    queryFn: fetchUser,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      const data = await response.json();
      localStorage.setItem('auth_token', data.token);
      return data.user;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["/api/auth/me"], user);
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (userData: { email: string; password: string; firstName: string; lastName?: string }) => {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      const data = await response.json();
      localStorage.setItem('auth_token', data.token);
      return data.user;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["/api/auth/me"], user);
    },
  });

  const anonymousLoginMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/auth/anonymous", {
        method: "POST",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      const data = await response.json();
      localStorage.setItem('auth_token', data.token);

      // Log if this is a returning session
      if (data.isReturningSession) {
        console.log("Welcome back! Continuing your anonymous session.");
      } else {
        console.log("New anonymous session created.");
      }

      return data.user;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["/api/auth/me"], user);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(["/api/auth/me"], null);
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    loginAnonymously: anonymousLoginMutation.mutateAsync,
    logout: logoutMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingInAnonymously: anonymousLoginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
}
