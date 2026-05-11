<script setup lang="ts">
import { onMounted } from "vue";
import { NavBar } from "@/widgets/navbar";
import { useAuthStore } from "@/entities/user";

const authStore = useAuthStore();

onMounted(() => {
    if (authStore.isAuthenticated && !authStore.user) {
        authStore.fetchUser();
    }
});
</script>

<template>
    <div class="min-h-screen bg-gray-50">
        <NavBar />
        <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <slot />
        </main>
    </div>
</template>
