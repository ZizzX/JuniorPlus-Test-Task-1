<script setup lang="ts">
import { ref } from "vue";
import { UiInput, UiButton } from "@/shared/ui";
import { useCreateNoteMutation } from "../api/useCreateNoteMutation";

const { mutateAsync: createNote, isPending } = useCreateNoteMutation();

const title = ref("");
const content = ref("");

const handleSubmit = async () => {
    if (!title.value) return;

    try {
        await createNote({ title: title.value, content: content.value });
        title.value = "";
        content.value = "";
    } catch (error) {
        console.error("Failed to create note:", error);
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
        <UiButton
            type="submit"
            variant="primary"
            class="w-full"
            :loading="isPending"
        >
            Create Note
        </UiButton>
    </form>
</template>
