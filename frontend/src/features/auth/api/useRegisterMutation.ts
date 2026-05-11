import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { api } from "@/shared/api";
import { useAuthStore } from "@/entities/user";

interface RegisterResponse {
  jwt: string;
}

export const useRegisterMutation = () => {
  const authStore = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Record<string, string>) => {
      const { data } = await api.post<RegisterResponse>("/users/register", payload);
      return data;
    },
    onSuccess: (data) => {
      authStore.setToken(data.jwt);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};
