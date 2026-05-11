<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { UiButton } from "@/shared/ui";
import { useDeleteNoteMutation } from "../api/useDeleteNoteMutation";

const { t } = useI18n();
const props = defineProps<{
    noteId: string;
}>();

const { mutate: deleteNote, isPending } = useDeleteNoteMutation();

const handleDelete = () => {
    if (confirm(t("notes.delete.confirm"))) {
        deleteNote(props.noteId);
    }
};
</script>

<template>
    <UiButton
        variant="danger"
        @click="handleDelete"
        class="p-2"
        :title="t('notes.delete.button')"
        :loading="isPending"
        icon="pi pi-trash"
    />
</template>
