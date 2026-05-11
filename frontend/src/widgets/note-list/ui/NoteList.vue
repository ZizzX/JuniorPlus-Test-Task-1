<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useNotesQuery } from "@/entities/note";
import { UiCard, UiButton } from "@/shared/ui";
import { EditNoteForm } from "@/features/note-edit";
import { DeleteNoteButton } from "@/features/note-delete";

const { t } = useI18n();
const { data: notes, isLoading, isError } = useNotesQuery();
const editingNoteId = ref<string | null>(null);

const startEdit = (id: string) => {
    editingNoteId.value = id;
};

const stopEdit = () => {
    editingNoteId.value = null;
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
};
</script>

<template>
    <div class="space-y-4">
        <div v-if="isLoading" class="text-center py-12">
            <p class="text-gray-500">{{ t("notes.loading") }}</p>
        </div>

        <div
            v-else-if="isError"
            class="text-center py-12 bg-red-50 text-red-600 rounded-lg"
        >
            <p>{{ t("notes.error") }}</p>
        </div>

        <div
            v-else-if="!notes || notes.length === 0"
            class="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300"
        >
            <p class="text-gray-500">{{ t("notes.empty") }}</p>
        </div>

        <div v-else v-for="note in notes" :key="note.id">
            <UiCard
                v-if="editingNoteId === note.id"
                :title="t('notes.edit.title')"
            >
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
                            :title="t('notes.edit.title')"
                            icon="pi pi-pencil"
                        />
                        <DeleteNoteButton :note-id="note.id" />
                    </div>
                </div>
                <template #footer>
                    <div class="text-xs text-gray-400">
                        {{
                            t("notes.updated", {
                                date: formatDate(note.updatedAt),
                            })
                        }}
                    </div>
                </template>
            </UiCard>
        </div>
    </div>
</template>
