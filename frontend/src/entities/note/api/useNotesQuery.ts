import { useQuery } from "@tanstack/vue-query";
import { api } from "@/shared/api";
import type { Note } from "../model/types";

export const useNotesQuery = () => {
  return useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      const { data } = await api.get<Note[]>("/notes");
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
