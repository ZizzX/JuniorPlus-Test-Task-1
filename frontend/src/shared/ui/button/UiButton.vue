<script setup lang="ts">
import Button from "primevue/button";

interface Props {
    type?: "button" | "submit" | "reset";
    variant?: "primary" | "secondary" | "danger" | "ghost";
    disabled?: boolean;
    loading?: boolean;
    icon?: string;
}

const props = withDefaults(defineProps<Props>(), {
    type: "button",
    variant: "primary",
    disabled: false,
    loading: false,
});

const getSeverity = () => {
    switch (props.variant) {
        case "primary":
            return "primary";
        case "secondary":
            return "secondary";
        case "danger":
            return "danger";
        case "ghost":
            return "secondary";
        default:
            return "primary";
    }
};

const getLink = () => props.variant === "ghost";
</script>

<template>
    <Button
        :type="type"
        :disabled="disabled"
        :loading="loading"
        :severity="getSeverity()"
        :text="getLink()"
        :icon="icon"
        class="w-full md:w-auto"
    >
        <slot />
    </Button>
</template>
