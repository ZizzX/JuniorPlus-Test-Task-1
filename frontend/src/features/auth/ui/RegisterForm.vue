<script setup lang="ts">
import { ref } from 'vue';
import { UiInput, UiButton } from '@/shared/ui';
import { useAuthStore } from '@/entities/user';

const authStore = useAuthStore();
const name = ref('');
const email = ref('');
const password = ref('');
const error = ref('');

const handleSubmit = async () => {
  error.value = '';
  authStore.isLoading = true;
  try {
    console.log('Register attempt:', { name: name.value, email: email.value, password: password.value });
    await new Promise(resolve => setTimeout(resolve, 500));

    authStore.setUser({
      id: '1',
      email: email.value,
      name: name.value,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    authStore.setToken('mock-jwt-token');
  } catch (e: any) {
    error.value = e.message || 'Registration failed';
  } finally {
    authStore.isLoading = false;
  }
};
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <UiInput
      v-model="name"
      label="Name"
      placeholder="John Doe"
      required
    />
    <UiInput
      v-model="email"
      type="email"
      label="Email"
      placeholder="your@email.com"
      required
    />
    <UiInput
      v-model="password"
      type="password"
      label="Password"
      placeholder="••••••••"
      required
    />
    <div v-if="error" class="text-sm text-red-500">{{ error }}</div>
    <UiButton type="submit" variant="primary" class="w-full" :disabled="authStore.isLoading">
      {{ authStore.isLoading ? 'Creating account...' : 'Register' }}
    </UiButton>
  </form>
</template>
