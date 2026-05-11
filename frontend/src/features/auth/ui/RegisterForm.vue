<script setup lang="ts">
import { ref } from "vue";
import { UiInput, UiButton } from "@/shared/ui";
import { useAuthStore } from "@/entities/user";
import { api } from "@/shared/api";

const authStore = useAuthStore();
const name = ref("");
const email = ref("");
const password = ref("");
const error = ref("");

const handleSubmit = async () => {
    error.value = "";
    authStore.isLoading = true;
    try {
        const response = await api.post("/users/register", {
            name: name.value,
            email: email.value,
            password: password.value,
        });

        authStore.setToken(response.data.jwt);
        await authStore.fetchUser();
    } catch (e: any) {
        error.value = e.response?.data?.message || "Registration failed";
    } finally {
        authStore.isLoading = false;
    }
};
</script>

<template>
    <form @submit.prevent="handleSubmit" class="space-y-4">
        <UiInput v-model="name" label="Name" placeholder="John Doe" required />
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
        <UiButton
            type="submit"
            variant="primary"
            class="w-full"
            :disabled="authStore.isLoading"
        >
            {{ authStore.isLoading ? "Creating account..." : "Register" }}
        </UiButton>
    </form>
</template>
