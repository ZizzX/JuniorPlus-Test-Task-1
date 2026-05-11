import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { api } from "@/shared/api";

export const useEditNoteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, title, content }: { id: string; title?: string; content?: string }) => {
      const { data } = await api.patch(`/notes/${id}`, { title, content });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
};
