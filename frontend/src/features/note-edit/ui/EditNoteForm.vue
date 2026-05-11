<script setup lang="ts">
import { ref } from "vue";
import { UiInput, UiButton } from "@/shared/ui";
import { type Note } from "@/entities/note";
import { useEditNoteMutation } from "../api/useEditNoteMutation";

const props = defineProps<{
    note: Note;
}>();

const emit = defineEmits<{
    (e: "success"): void;
    (e: "cancel"): void;
}>();

const { mutateAsync: editNote, isPending } = useEditNoteMutation();
const title = ref(props.note.title);
const content = ref(props.note.content);

const handleSubmit = async () => {
    if (!title.value) return;

    try {
        await editNote({
            id: props.note.id,
            title: title.value,
            content: content.value,
        });
        emit("success");
    } catch (error) {
        console.error("Failed to edit note:", error);
    }
};
</script>

<template>
    <form @submit.prevent="handleSubmit" class="space-y-4">
        <UiInput
            v-model="title"
            label="Title"
            placeholder="Note title"
            required
            :disabled="isPending"
        />
        <div class="flex flex-col gap-1 w-full">
            <label class="text-sm font-medium text-gray-700">Content</label>
            <textarea
                v-model="content"
                class="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Note content..."
                rows="3"
                :disabled="isPending"
            ></textarea>
        </div>
        <div class="flex gap-2">
            <UiButton
                type="submit"
                variant="primary"
                class="flex-1"
                :loading="isPending"
            >
                Save Changes
            </UiButton>
            <UiButton
                type="button"
                variant="ghost"
                @click="emit('cancel')"
                :disabled="isPending"
            >
                Cancel
            </UiButton>
        </div>
    </form>
</template>
