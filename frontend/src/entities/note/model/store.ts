import { defineStore } from "pinia";
import { ref } from "vue";
import type { Note } from "./types";
import { api } from "@/shared/api";

export const useNoteStore = defineStore("notes", () => {
  const notes = ref<Note[]>([]);
  const currentNote = ref<Note | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function fetchNotes() {
    isLoading.value = true;
    try {
      const response = await api.get("/notes");
      notes.value = response.data;
    } catch (e: any) {
      error.value = e.response?.data?.message || "Failed to fetch notes";
    } finally {
      isLoading.value = false;
    }
  }

  async function addNote(title: string, content: string) {
    try {
      const response = await api.post("/notes", { title, content });
      notes.value.unshift(response.data);
    } catch (e: any) {
      error.value = e.response?.data?.message || "Failed to create note";
    }
  }

  async function updateNote(id: string, title: string, content: string) {
    try {
      const response = await api.patch(`/notes/${id}`, { title, content });
      const index = notes.value.findIndex((n) => n.id === id);
      if (index !== -1) {
        notes.value[index] = response.data;
      }
      if (currentNote.value?.id === id) {
        currentNote.value = response.data;
      }
    } catch (e: any) {
      error.value = e.response?.data?.message || "Failed to update note";
    }
  }

  async function deleteNote(id: string) {
    try {
      await api.delete(`/notes/${id}`);
      notes.value = notes.value.filter((n) => n.id !== id);
      if (currentNote.value?.id === id) {
        currentNote.value = null;
      }
    } catch (e: any) {
      error.value = e.response?.data?.message || "Failed to delete note";
    }
  }

  function setCurrentNote(note: Note | null) {
    currentNote.value = note;
  }

  return {
    notes,
    currentNote,
    isLoading,
    error,
    fetchNotes,
    addNote,
    updateNote,
    deleteNote,
    setCurrentNote,
  };
});
