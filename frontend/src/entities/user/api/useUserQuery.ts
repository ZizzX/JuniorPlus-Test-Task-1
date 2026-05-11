import { useQuery } from "@tanstack/vue-query";
import { api } from "@/shared/api";
import type { User } from "../model/types";
import { useAuthStore } from "../model/store";

export const useUserQuery = () => {
  const authStore = useAuthStore();

  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await api.get<User>("/users/info");
      return data;
    },
    enabled: !!authStore.token,
    staleTime: Infinity, // User info doesn't change often
    retry: false,
  });
};
