<script setup lang="ts">
interface Props {
  title?: string;
  subtitle?: string;
}

defineProps<Props>();
</script>

<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
    <div v-if="title || $slots.header" class="px-6 py-4 border-b border-gray-100">
      <slot name="header">
        <h3 v-if="title" class="text-lg font-semibold text-gray-900">{{ title }}</h3>
        <p v-if="subtitle" class="text-sm text-gray-500">{{ subtitle }}</p>
      </slot>
    </div>

    <div class="px-6 py-4">
      <slot />
    </div>

    <div v-if="$slots.footer" class="px-6 py-3 bg-gray-50 border-t border-gray-100">
      <slot name="footer" />
    </div>
  </div>
</template>
