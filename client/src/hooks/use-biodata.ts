import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useBiodata() {
  return useQuery({
    queryKey: ["biodata"],
    queryFn: async () => {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(api.biodata.list.path, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!response.ok) throw new Error("Failed to fetch biodata");
      return response.json();
    },
  });
}

