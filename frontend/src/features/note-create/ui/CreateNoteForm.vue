<script setup lang="ts">
import { ref, computed } from "vue";
import { UiInput, UiButton } from "@/shared/ui";
import { useCreateNoteMutation } from "../api/useCreateNoteMutation";

const { mutateAsync: createNote, isPending } = useCreateNoteMutation();

const title = ref("");
const content = ref("");
const errors = ref<{ title?: string; content?: string }>({});
const serverError = ref("");

// Backend constants for validation
const TITLE_MAX_LENGTH = 255;
const CONTENT_MAX_LENGTH = 10000;

const validate = () => {
    const newErrors: { title?: string; content?: string } = {};

    if (!title.value.trim()) {
        newErrors.title = "Заголовок должен содержать минимум 1 символ";
    } else if (title.value.length > TITLE_MAX_LENGTH) {
        newErrors.title = `Заголовок не должен превышать ${TITLE_MAX_LENGTH} символов`;
    }

    if (!content.value.trim()) {
        newErrors.content = "Содержимое должно содержать минимум 1 символ";
    } else if (content.value.length > CONTENT_MAX_LENGTH) {
        newErrors.content = `Содержимое не должно превышать ${CONTENT_MAX_LENGTH} символов`;
    }

    errors.value = newErrors;
    return Object.keys(newErrors).length === 0;
};

const handleSubmit = async () => {
    serverError.value = "";
    if (!validate()) return;

    try {
        await createNote({
            title: title.value.trim(),
            content: content.value.trim(),
        });
        title.value = "";
        content.value = "";
        errors.value = {};
    } catch (error: any) {
        serverError.value =
            error.response?.data?.message ||
            "Не удалось создать заметку. Попробуйте позже.";
        console.error("Failed to create note:", error);
    }
};

const titleCharCount = computed(() => title.value.length);
const contentCharCount = computed(() => content.value.length);
</script>

<template>
    <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="space-y-1">
            <UiInput
                v-model="title"
                label="Title"
                placeholder="Note title"
                :error="errors.title"
                :disabled="isPending"
            />
            <div class="flex justify-end">
                <span
                    class="text-[10px]"
                    :class="
                        titleCharCount > TITLE_MAX_LENGTH
                            ? 'text-red-500'
                            : 'text-gray-400'
                    "
                >
                    {{ titleCharCount }} / {{ TITLE_MAX_LENGTH }}
                </span>
            </div>
        </div>

        <div class="flex flex-col gap-1 w-full">
            <label class="text-sm font-medium text-gray-700">Content</label>
            <textarea
                v-model="content"
                class="px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                :class="{
                    'border-gray-300 focus:ring-blue-500 focus:border-blue-500':
                        !errors.content,
                    'border-red-500 focus:ring-red-500 focus:border-red-500':
                        errors.content,
                }"
                placeholder="Note content..."
                rows="4"
                :disabled="isPending"
            ></textarea>
            <div class="flex justify-between items-start">
                <span v-if="errors.content" class="text-xs text-red-500">{{
                    errors.content
                }}</span>
                <span v-else></span>
                <span
                    class="text-[10px]"
                    :class="
                        contentCharCount > CONTENT_MAX_LENGTH
                            ? 'text-red-500'
                            : 'text-gray-400'
                    "
                >
                    {{ contentCharCount }} / {{ CONTENT_MAX_LENGTH }}
                </span>
            </div>
        </div>

        <div
            v-if="serverError"
            class="p-3 bg-red-50 border border-red-200 rounded-md"
        >
            <p class="text-sm text-red-600 text-center">{{ serverError }}</p>
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
