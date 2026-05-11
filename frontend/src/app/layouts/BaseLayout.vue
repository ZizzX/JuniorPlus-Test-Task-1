<script setup lang="ts">
import { NavBar } from "@/widgets/navbar";
import { useUserQuery } from "@/entities/user";

// This hook will handle fetching user info if token is present
useUserQuery();
</script>

<template>
    <div class="min-h-screen bg-gray-50">
        <NavBar />
        <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <slot />
        </main>
    </div>
</template>
