<script setup lang="ts">
import Card from "primevue/card";

interface Props {
    title?: string;
    subtitle?: string;
}

defineProps<Props>();
</script>

<template>
    <Card class="overflow-hidden">
        <template v-if="title || $slots.header" #header>
            <slot name="header" />
        </template>
        <template v-if="title" #title>{{ title }}</template>
        <template v-if="subtitle" #subtitle>{{ subtitle }}</template>
        <template #content>
            <slot />
        </template>
        <template v-if="$slots.footer" #footer>
            <slot name="footer" />
        </template>
    </Card>
</template>
