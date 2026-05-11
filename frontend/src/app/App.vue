<script setup lang="ts">
import { ref } from "vue";
import { UiButton, UiCard } from "@/shared/ui";
import { useAuthStore } from "@/entities/user";
import { useNoteStore, type Note } from "@/entities/note";
import { LoginForm, RegisterForm } from "@/features/auth";
import { CreateNoteForm } from "@/features/note-create";
import { EditNoteForm } from "@/features/note-edit";
import { DeleteNoteButton } from "@/features/note-delete";

const authStore = useAuthStore();
const noteStore = useNoteStore();
const isLogin = ref(true);
const editingNote = ref<Note | null>(null);

const logout = () => {
    authStore.logout();
};

const handleEditSuccess = () => {
    editingNote.value = null;
};
</script>

<template>
    <div class="min-h-screen bg-gray-50 p-8">
        <div class="max-w-4xl mx-auto space-y-8">
            <header class="flex justify-between items-center">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900">
                        Features Layer Demo
                    </h1>
                    <p class="text-gray-600 mt-2">
                        FSD: Shared -> Entities -> Features
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
            </header>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <!-- Auth Features -->
                <div v-if="!authStore.isAuthenticated">
                    <UiCard :title="isLogin ? 'Login' : 'Register'">
                        <LoginForm v-if="isLogin" />
                        <RegisterForm v-else />
                        <template #footer>
                            <button
                                @click="isLogin = !isLogin"
                                class="text-sm text-blue-600 hover:underline w-full text-center"
                            >
                                {{
                                    isLogin
                                        ? "Don't have an account? Register"
                                        : "Already have an account? Login"
                                }}
                            </button>
                        </template>
                    </UiCard>
                </div>

                <!-- Note Create Feature -->
                <div v-else>
                    <UiCard title="Create New Note">
                        <CreateNoteForm />
                    </UiCard>
                </div>

                <!-- Notes List (demonstrating Edit/Delete features) -->
                <div class="space-y-4">
                    <h3 class="text-xl font-bold text-gray-900">
                        Your Notes ({{ noteStore.notes.length }})
                    </h3>
                    <div
                        v-if="noteStore.notes.length === 0"
                        class="text-gray-400 py-8 text-center bg-white rounded-lg border border-dashed border-gray-300"
                    >
                        No notes yet. Create one!
                    </div>
                    <div
                        v-for="note in noteStore.notes"
                        :key="note.id"
                        class="space-y-4"
                    >
                        <UiCard
                            v-if="editingNote?.id === note.id"
                            title="Edit Note"
                        >
                            <EditNoteForm
                                :note="note"
                                @success="handleEditSuccess"
                                @cancel="editingNote = null"
                            />
                        </UiCard>
                        <UiCard v-else>
                            <div class="flex justify-between items-start">
                                <div>
                                    <h4 class="font-bold text-lg text-gray-900">
                                        {{ note.title }}
                                    </h4>
                                    <p
                                        class="text-gray-600 mt-1 whitespace-pre-wrap"
                                    >
                                        {{ note.content }}
                                    </p>
                                </div>
                                <div class="flex gap-2">
                                    <UiButton
                                        variant="ghost"
                                        @click="editingNote = note"
                                        class="p-2"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            class="h-5 w-5"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                                            />
                                        </svg>
                                    </UiButton>
                                    <DeleteNoteButton :noteId="note.id" />
                                </div>
                            </div>
                            <div class="mt-4 text-xs text-gray-400">
                                Created:
                                {{ new Date(note.createdAt).toLocaleString() }}
                            </div>
                        </UiCard>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
