import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { api } from "@/shared/api";

export const useCreateNoteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { title: string; content: string }) => {
      const { data } = await api.post("/notes", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
};
