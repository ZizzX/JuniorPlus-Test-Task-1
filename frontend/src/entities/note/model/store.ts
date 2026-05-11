import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Note } from './types';

export const useNoteStore = defineStore('notes', () => {
  const notes = ref<Note[]>([]);
  const currentNote = ref<Note | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  function setNotes(newNotes: Note[]) {
    notes.value = newNotes;
  }

  function addNote(note: Note) {
    notes.value.unshift(note);
  }

  function updateNote(updatedNote: Note) {
    const index = notes.value.findIndex((n) => n.id === updatedNote.id);
    if (index !== -1) {
      notes.value[index] = updatedNote;
    }
    if (currentNote.value?.id === updatedNote.id) {
      currentNote.value = updatedNote;
    }
  }

  function deleteNote(id: string) {
    notes.value = notes.value.filter((n) => n.id !== id);
    if (currentNote.value?.id === id) {
      currentNote.value = null;
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
    setNotes,
    addNote,
    updateNote,
    deleteNote,
    setCurrentNote,
  };
});
