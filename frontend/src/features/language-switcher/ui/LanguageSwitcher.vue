<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();

const languages = [
  { code: 'ru', name: 'RU' },
  { code: 'en', name: 'EN' },
  { code: 'kk', name: 'KK' },
];

const toggleLanguage = (code: string) => {
  locale.value = code;
  localStorage.setItem('locale', code);
};
</script>

<template>
  <div class="flex gap-2">
    <button
      v-for="lang in languages"
      :key="lang.code"
      @click="toggleLanguage(lang.code)"
      class="px-2 py-1 text-xs font-medium rounded transition-colors"
      :class="locale === lang.code ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
    >
      {{ lang.name }}
    </button>
  </div>
</template>
