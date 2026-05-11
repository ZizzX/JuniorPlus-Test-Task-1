<script setup lang="ts">
import { ref } from "vue";
import { UiButton, UiInput, UiCard } from "../shared/ui";

const testInput = ref("");
</script>

<template>
    <div class="min-h-screen bg-gray-50 p-8">
        <div class="max-w-2xl mx-auto space-y-8">
            <header>
                <h1 class="text-3xl font-bold text-gray-900">
                    Shared Layer Demo
                </h1>
                <p class="text-gray-600 mt-2">
                    Vue 3 + Tailwind CSS v4 + FSD Structure
                </p>
            </header>

            <section class="space-y-6">
                <UiCard
                    title="UI Components Showcase"
                    subtitle="Reusable components from the Shared layer"
                >
                    <div class="space-y-6">
                        <!-- Buttons -->
                        <div class="space-y-2">
                            <h4 class="text-sm font-medium text-gray-700">
                                Buttons
                            </h4>
                            <div class="flex flex-wrap gap-4">
                                <UiButton variant="primary">Primary</UiButton>
                                <UiButton variant="secondary"
                                    >Secondary</UiButton
                                >
                                <UiButton variant="danger">Danger</UiButton>
                                <UiButton variant="ghost">Ghost</UiButton>
                                <UiButton disabled>Disabled</UiButton>
                            </div>
                        </div>

                        <!-- Inputs -->
                        <div class="space-y-2">
                            <h4 class="text-sm font-medium text-gray-700">
                                Inputs
                            </h4>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <UiInput
                                    v-model="testInput"
                                    label="Text Input"
                                    placeholder="Type something..."
                                />
                                <UiInput
                                    v-model="testInput"
                                    label="Error State"
                                    error="This field is required"
                                />
                            </div>
                            <p class="text-sm text-gray-500">
                                Value: {{ testInput }}
                            </p>
                        </div>
                    </div>

                    <template #footer>
                        <div class="flex justify-end">
                            <UiButton variant="primary">Save Changes</UiButton>
                        </div>
                    </template>
                </UiCard>

                <UiCard title="API Configuration">
                    <p class="text-gray-700">
                        Axios instance is configured with interceptors for JWT
                        and error handling.
                    </p>
                    <div class="mt-4 p-3 bg-gray-100 rounded text-xs font-mono">
                        baseURL: import.meta.env.VITE_API_URL ||
                        'http://localhost:3000/api'
                    </div>
                </UiCard>
            </section>
        </div>
    </div>
</template>
