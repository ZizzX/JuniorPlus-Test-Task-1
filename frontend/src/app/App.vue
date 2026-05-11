<script setup lang="ts">
import { ref } from "vue";
import { UiButton, UiInput, UiCard } from "../shared/ui";
import { useAuthStore } from "../entities/user";
import { useNoteStore } from "../entities/note";

const authStore = useAuthStore();
const noteStore = useNoteStore();
const testInput = ref("");

const loginAsGuest = () => {
    authStore.setUser({
        id: "1",
        email: "guest@example.com",
        name: "Guest User",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    });
    authStore.setToken("mock-jwt-token");
};

const logout = () => {
    authStore.logout();
};

const addMockNote = () => {
    noteStore.addNote({
        id: crypto.randomUUID(),
        title: "New Mock Note",
        content: "This is a note created in the Pinia store.",
        userId: authStore.user?.id || "0",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    });
};
</script>

<template>
    <div class="min-h-screen bg-gray-50 p-8">
        <div class="max-w-4xl mx-auto space-y-8">
            <header class="flex justify-between items-center">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900">
                        Entities & Stores Demo
                    </h1>
                    <p class="text-gray-600 mt-2">
                        Vue 3 + Pinia + FSD Structure
                    </p>
                </div>
                <div
                    v-if="authStore.isAuthenticated"
                    class="flex items-center gap-4"
                >
                    <span class="text-sm text-gray-700"
                        >Logged in as:
                        <strong>{{ authStore.user?.name }}</strong></span
                    >
                    <UiButton variant="ghost" @click="logout">Logout</UiButton>
                </div>
                <div v-else>
                    <UiButton variant="primary" @click="loginAsGuest"
                        >Login as Guest</UiButton
                    >
                </div>
            </header>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <!-- Auth Section -->
                <UiCard title="Auth Entity">
                    <div class="space-y-4">
                        <div
                            class="p-3 bg-gray-100 rounded text-xs font-mono overflow-auto max-h-40"
                        >
                            <pre>{{
                                JSON.stringify(authStore.$state, null, 2)
                            }}</pre>
                        </div>
                    </div>
                </UiCard>

                <!-- Notes Section -->
                <UiCard title="Notes Entity">
                    <div class="space-y-4">
                        <div class="flex justify-between items-center">
                            <h4 class="font-medium">
                                Total Notes: {{ noteStore.notes.length }}
                            </h4>
                            <UiButton
                                variant="secondary"
                                @click="addMockNote"
                                :disabled="!authStore.isAuthenticated"
                            >
                                Add Note
                            </UiButton>
                        </div>

                        <div class="space-y-2 max-h-60 overflow-y-auto">
                            <div
                                v-for="note in noteStore.notes"
                                :key="note.id"
                                class="p-2 border rounded bg-white shadow-sm"
                            >
                                <h5 class="font-bold text-sm">
                                    {{ note.title }}
                                </h5>
                                <p class="text-xs text-gray-500 truncate">
                                    {{ note.content }}
                                </p>
                            </div>
                            <p
                                v-if="noteStore.notes.length === 0"
                                class="text-center text-gray-400 py-4 text-sm"
                            >
                                No notes yet. Login and add some!
                            </p>
                        </div>
                    </div>
                </UiCard>
            </div>

            <!-- Shared UI Showcase -->
            <UiCard title="Shared UI (Reminder)">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-2">
                        <h4 class="text-sm font-medium text-gray-700">
                            Inputs
                        </h4>
                        <UiInput
                            v-model="testInput"
                            label="Live Binding"
                            placeholder="Type..."
                        />
                        <p class="text-xs text-gray-500">
                            Value: {{ testInput }}
                        </p>
                    </div>
                    <div class="space-y-2">
                        <h4 class="text-sm font-medium text-gray-700">
                            Buttons
                        </h4>
                        <div class="flex gap-2">
                            <UiButton variant="danger">Action</UiButton>
                            <UiButton variant="ghost">Cancel</UiButton>
                        </div>
                    </div>
                </div>
            </UiCard>
        </div>
    </div>
</template>
