<script setup lang="ts">
interface Props {
    type?: "button" | "submit" | "reset";
    variant?: "primary" | "secondary" | "danger" | "ghost";
    disabled?: boolean;
    loading?: boolean;
}

withDefaults(defineProps<Props>(), {
    type: "button",
    variant: "primary",
    disabled: false,
    loading: false,
});
</script>

<template>
    <button
        :type="type"
        :disabled="disabled || loading"
        class="relative flex items-center justify-center px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        :class="{
            'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500':
                variant === 'primary',
            'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400':
                variant === 'secondary',
            'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500':
                variant === 'danger',
            'bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-300':
                variant === 'ghost',
        }"
    >
        <span
            v-if="loading"
            class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
            <svg
                class="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
                <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                ></circle>
                <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
            </svg>
        </span>
        <span :class="{ 'opacity-0': loading }">
            <slot />
        </span>
    </button>
</template>
