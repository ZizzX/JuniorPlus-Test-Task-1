<script setup lang="ts">
import { ref } from "vue";
import { UiInput, UiButton } from "@/shared/ui";
import { useNoteStore, type Note } from "@/entities/note";

const props = defineProps<{
    note: Note;
}>();

const emit = defineEmits<{
    (e: "success"): void;
    (e: "cancel"): void;
}>();

const noteStore = useNoteStore();
const title = ref(props.note.title);
const content = ref(props.note.content);

const handleSubmit = async () => {
    if (!title.value) return;

    await noteStore.updateNote(props.note.id, title.value, content.value);
    emit("success");
};
</script>

<template>
    <form @submit.prevent="handleSubmit" class="space-y-4">
        <UiInput
            v-model="title"
            label="Title"
            placeholder="Note title"
            required
        />
        <div class="flex flex-col gap-1 w-full">
            <label class="text-sm font-medium text-gray-700">Content</label>
            <textarea
                v-model="content"
                class="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Note content..."
                rows="3"
            ></textarea>
        </div>
        <div class="flex gap-2">
            <UiButton type="submit" variant="primary" class="flex-1">
                Save Changes
            </UiButton>
            <UiButton type="button" variant="ghost" @click="emit('cancel')">
                Cancel
            </UiButton>
        </div>
    </form>
</template>
