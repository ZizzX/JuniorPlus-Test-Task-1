<script setup lang="ts">
import { ref } from 'vue';
import { UiInput, UiButton } from '@/shared/ui';
import { useNoteStore } from '@/entities/note';
import { useAuthStore } from '@/entities/user';

const noteStore = useNoteStore();
const authStore = useAuthStore();
const title = ref('');
const content = ref('');

const handleSubmit = async () => {
  if (!title.value) return;

  const newNote = {
    id: crypto.randomUUID(),
    title: title.value,
    content: content.value,
    userId: authStore.user?.id || '0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  noteStore.addNote(newNote);
  title.value = '';
  content.value = '';
};
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <UiInput v-model="title" label="Title" placeholder="Note title" required />
    <div class="flex flex-col gap-1 w-full">
      <label class="text-sm font-medium text-gray-700">Content</label>
      <textarea
        v-model="content"
        class="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        placeholder="Note content..."
        rows="3"
      ></textarea>
    </div>
    <UiButton type="submit" variant="primary" class="w-full">
      Create Note
    </UiButton>
  </form>
</template>
