<script setup lang="ts">
import BaseLayout from '@/app/layouts/BaseLayout.vue';
import { LoginForm } from '@/features/auth';
import { UiCard } from '@/shared/ui';
import { useAuthStore } from '@/entities/user';
import { watchEffect } from 'vue';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

watchEffect(() => {
  if (authStore.isAuthenticated) {
    router.push('/');
  }
});
</script>

<template>
  <BaseLayout>
    <div class="max-w-md mx-auto mt-12">
      <UiCard title="Login to NotesApp" subtitle="Enter your credentials to continue">
        <LoginForm />
        <template #footer>
          <div class="text-center text-sm text-gray-500">
            Don't have an account?
            <router-link to="/register" class="text-blue-600 hover:underline font-medium">
              Register here
            </router-link>
          </div>
        </template>
      </UiCard>
    </div>
  </BaseLayout>
</template>
