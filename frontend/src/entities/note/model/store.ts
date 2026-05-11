import { defineStore } from "pinia";
import { ref } from "vue";
import type { Note } from "./types";

export const useNoteStore = defineStore("notes", () => {
  const currentNote = ref<Note | null>(null);

  function setCurrentNote(note: Note | null) {
    currentNote.value = note;
  }

  return {
    currentNote,
    setCurrentNote,
  };
});
