import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useDashboardStats() {
  return useQuery({
    queryKey: [api.dashboard.stats.path],
    queryFn: async () => {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(api.dashboard.stats.path, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (!res.ok) throw new Error("Failed to fetch stats");
      return api.dashboard.stats.responses[200].parse(await res.json());
    },
  });
}
