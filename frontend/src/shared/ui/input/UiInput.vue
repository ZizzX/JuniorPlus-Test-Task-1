<script setup lang="ts">
import InputText from "primevue/inputtext";

interface Props {
    modelValue: string;
    type?: string;
    placeholder?: string;
    label?: string;
    error?: string;
    disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
    type: "text",
    placeholder: "",
    disabled: false,
});

const emit = defineEmits<{
    (e: "update:modelValue", value: string): void;
}>();

const onInput = (value: string | undefined) => {
    emit("update:modelValue", value ?? "");
};
</script>

<template>
    <div class="flex flex-col gap-1 w-full">
        <label
            v-if="label"
            class="text-sm font-medium text-surface-700 dark:text-surface-0/70"
        >
            {{ label }}
        </label>
        <InputText
            :type="type"
            :model-value="modelValue"
            @update:model-value="onInput"
            :placeholder="placeholder"
            :disabled="disabled"
            :invalid="!!error"
            class="w-full"
        />
        <small v-if="error" class="text-red-500">{{ error }}</small>
    </div>
</template>
