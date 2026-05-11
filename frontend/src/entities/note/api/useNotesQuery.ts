import { useQuery } from "@tanstack/vue-query";
import { api } from "@/shared/api";
import type { Note } from "../model/types";

export const useNotesQuery = () => {
  return useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      const { data } = await api.get<{ notes: Note[]; total: number }>(
        "/notes",
      );
      return data.notes;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
