import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type SubmitResponseRequest } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

// Public: Get Set by Token
export function usePublicSet(token: string) {
  return useQuery({
    queryKey: [api.public.getSet.path, token],
    queryFn: async () => {
      const url = buildUrl(api.public.getSet.path, { token });
      const res = await fetch(url); // No credentials for public
      if (!res.ok) throw new Error("Set not found");
      return api.public.getSet.responses[200].parse(await res.json());
    },
    enabled: !!token,
    retry: false,
  });
}

// Public: Submit Response
export function useSubmitResponse() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ token, data }: { token: string; data: SubmitResponseRequest }) => {
      const url = buildUrl(api.public.submitResponse.path, { token });
      const res = await fetch(url, {
        method: api.public.submitResponse.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to submit response");
      }
      return api.public.submitResponse.responses[201].parse(await res.json());
    },
    onError: (err) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });
}

// Protected: Get Responses for a Set
export function useSetResponses(setId: number) {
  return useQuery({
    queryKey: [api.responses.list.path, setId],
    queryFn: async () => {
      const token = localStorage.getItem('auth_token');
      const url = buildUrl(api.responses.list.path, { setId });
      const res = await fetch(url, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (!res.ok) throw new Error("Failed to fetch responses");
      return api.responses.list.responses[200].parse(await res.json());
    },
    enabled: !!setId && !isNaN(setId),
  });
}
