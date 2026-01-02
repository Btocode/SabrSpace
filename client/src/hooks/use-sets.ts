import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type QuestionSet, type CreateSetRequest, type UpdateSetRequest } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

// Fetch all sets for the user
export function useSets() {
  return useQuery({
    queryKey: [api.sets.list.path],
    queryFn: async () => {
      const res = await fetch(api.sets.list.path, { credentials: "include" });
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
      const url = buildUrl(api.sets.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch set");
      return api.sets.get.responses[200].parse(await res.json());
    },
    enabled: !!id && !isNaN(id),
  });
}

// Create a new set
export function useCreateSet() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateSetRequest) => {
      const res = await fetch(api.sets.create.path, {
        method: api.sets.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create set");
      }
      return api.sets.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.sets.list.path] });
      toast({ title: "Success", description: "Question set created successfully" });
    },
    onError: (err) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });
}

// Update an existing set
export function useUpdateSet() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateSetRequest }) => {
      const url = buildUrl(api.sets.update.path, { id });
      const res = await fetch(url, {
        method: api.sets.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update set");
      return api.sets.update.responses[200].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [api.sets.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.sets.get.path, variables.id] });
      toast({ title: "Success", description: "Question set updated" });
    },
    onError: (err) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });
}

// Delete a set
export function useDeleteSet() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.sets.delete.path, { id });
      const res = await fetch(url, {
        method: api.sets.delete.method,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete set");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.sets.list.path] });
      toast({ title: "Deleted", description: "Question set removed" });
    },
  });
}
