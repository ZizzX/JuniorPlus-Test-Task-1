<script setup lang="ts">
import { ref } from "vue";
import { useNotesQuery } from "@/entities/note";
import { UiCard, UiButton } from "@/shared/ui";
import { EditNoteForm } from "@/features/note-edit";
import { DeleteNoteButton } from "@/features/note-delete";

const { data: notes, isLoading, isError } = useNotesQuery();
const editingNoteId = ref<string | null>(null);

const startEdit = (id: string) => {
    editingNoteId.value = id;
};

const stopEdit = () => {
    editingNoteId.value = null;
};
</script>

<template>
    <div class="space-y-4">
        <div v-if="isLoading" class="text-center py-12">
            <p class="text-gray-500">Loading notes...</p>
        </div>

        <div
            v-else-if="isError"
            class="text-center py-12 bg-red-50 text-red-600 rounded-lg"
        >
            <p>Error loading notes. Please try again later.</p>
        </div>

        <div
            v-else-if="!notes || notes.length === 0"
            class="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300"
        >
            <p class="text-gray-500">No notes yet. Create your first one!</p>
        </div>

        <div v-else v-for="note in notes" :key="note.id">
            <UiCard v-if="editingNoteId === note.id" title="Edit Note">
                <EditNoteForm
                    :note="note"
                    @success="stopEdit"
                    @cancel="stopEdit"
                />
            </UiCard>

            <UiCard v-else>
                <div class="flex justify-between items-start">
                    <div class="flex-1">
                        <h3 class="text-lg font-bold text-gray-900">
                            {{ note.title }}
                        </h3>
                        <p class="text-gray-600 mt-2 whitespace-pre-wrap">
                            {{ note.content }}
                        </p>
                    </div>
                    <div class="flex gap-2 ml-4">
                        <UiButton
                            variant="ghost"
                            class="p-2"
                            @click="startEdit(note.id)"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                                />
                            </svg>
                        </UiButton>
                        <DeleteNoteButton :note-id="note.id" />
                    </div>
                </div>
                <template #footer>
                    <div class="text-xs text-gray-400">
                        Updated: {{ new Date(note.updatedAt).toLocaleString() }}
                    </div>
                </template>
            </UiCard>
        </div>
    </div>
</template>
