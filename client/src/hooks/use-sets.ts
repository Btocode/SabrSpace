import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type QuestionSet, type CreateSetRequest, type UpdateSetRequest } from "@shared/schema";
import { successToast, errorToast } from "@/components/ui/toast-custom";

// Fetch all sets for the user
export function useSets() {
  return useQuery({
    queryKey: [api.sets.list.path],
    queryFn: async () => {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(api.sets.list.path, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (!res.ok) throw new Error("Failed to fetch sets");
      return api.sets.list.responses[200].parse(await res.json());
    },
  });
}

// Fetch a single set details (protected)
export function useSet(id: number) {
  return useQuery({
    queryKey: [api.sets.get.path, id],
    queryFn: async () => {
      const token = localStorage.getItem('auth_token');
      const url = buildUrl(api.sets.get.path, { id });
      const res = await fetch(url, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (!res.ok) throw new Error("Failed to fetch set");
      return api.sets.get.responses[200].parse(await res.json());
    },
    enabled: !!id && !isNaN(id),
  });
}

// Create a new set
export function useCreateSet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateSetRequest) => {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(api.sets.create.path, {
        method: api.sets.create.method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create set");
      }
      return api.sets.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.sets.list.path] });
    },
  });
}

// Update an existing set
export function useUpdateSet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateSetRequest }) => {
      const token = localStorage.getItem('auth_token');
      const url = buildUrl(api.sets.update.path, { id });
      const res = await fetch(url, {
        method: api.sets.update.method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update set");
      return api.sets.update.responses[200].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [api.sets.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.sets.get.path, variables.id] });
    },
  });
}

// Delete a set
export function useDeleteSet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const token = localStorage.getItem('auth_token');
      const url = buildUrl(api.sets.delete.path, { id });
      const res = await fetch(url, {
        method: api.sets.delete.method,
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("Failed to delete set");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.sets.list.path] });
    },
  });
}

// Add answerer curator
export function useAddAnswererCurator() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ token, email }: { token: string; email: string }) => {
      const url = buildUrl(api.sets.addAnswererCurator.path, { token });
      console.log("Frontend: Calling curator API:", url, { email });
      const res = await fetch(url, {
        method: api.sets.addAnswererCurator.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      console.log("Frontend: Response status:", res.status, res.ok);
      if (!res.ok) {
        const errorText = await res.text();
        console.log("Frontend: Error response:", errorText);
        throw new Error(errorText || "Failed to add curator");
      }
      const responseData = await res.json();
      console.log("Frontend: Success response:", responseData);
      return api.sets.addAnswererCurator.responses[200].parse(responseData);
    },
    onSuccess: (data, variables) => {
      // Invalidate the specific public set query to refresh curator information
      queryClient.invalidateQueries({ queryKey: [api.public.getSet.path, variables.token] });
    },
  });
}
