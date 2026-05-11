<script setup lang="ts">
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import Textarea from "primevue/textarea";
import { UiInput, UiButton } from "@/shared/ui";
import { type Note } from "@/entities/note";
import { useEditNoteMutation } from "../api/useEditNoteMutation";

const { t } = useI18n();
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
const errors = ref<{ title?: string; content?: string }>({});
const serverError = ref("");

// Backend constants for validation
const TITLE_MAX_LENGTH = 255;
const CONTENT_MAX_LENGTH = 10000;

const validate = () => {
    const newErrors: { title?: string; content?: string } = {};

    if (!title.value.trim()) {
        newErrors.title = t("notes.validation.titleRequired");
    } else if (title.value.length > TITLE_MAX_LENGTH) {
        newErrors.title = t("notes.validation.titleTooLong", {
            max: TITLE_MAX_LENGTH,
        });
    }

    if (!content.value.trim()) {
        newErrors.content = t("notes.validation.contentRequired");
    } else if (content.value.length > CONTENT_MAX_LENGTH) {
        newErrors.content = t("notes.validation.contentTooLong", {
            max: CONTENT_MAX_LENGTH,
        });
    }

    errors.value = newErrors;
    return Object.keys(newErrors).length === 0;
};

const handleSubmit = async () => {
    serverError.value = "";
    if (!validate()) return;

    try {
        await editNote({
            id: props.note.id,
            title: title.value.trim(),
            content: content.value.trim(),
        });
        emit("success");
        errors.value = {};
    } catch (error: any) {
        serverError.value =
            error.response?.data?.message || t("notes.edit.error");
        console.error("Failed to edit note:", error);
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
                :label="t('notes.fields.title.label')"
                :placeholder="t('notes.fields.title.placeholder')"
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
            <label
                class="text-sm font-medium text-surface-700 dark:text-surface-0/70"
                >{{ t("notes.fields.content.label") }}</label
            >
            <Textarea
                v-model="content"
                :placeholder="t('notes.fields.content.placeholder')"
                rows="4"
                :disabled="isPending"
                :invalid="!!errors.content"
                class="w-full"
                autoResize
            />
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

        <div class="flex gap-2">
            <UiButton
                type="submit"
                variant="primary"
                class="flex-1"
                :loading="isPending"
            >
                {{ t("notes.edit.submit") }}
            </UiButton>
            <UiButton
                type="button"
                variant="ghost"
                @click="emit('cancel')"
                :disabled="isPending"
            >
                {{ t("common.cancel") }}
            </UiButton>
        </div>
    </form>
</template>
