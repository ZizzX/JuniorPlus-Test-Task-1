<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useAuthStore, useUserQuery } from "@/entities/user";
import { UiButton } from "@/shared/ui";
import { LanguageSwitcher } from "@/features/language-switcher";
import { useRouter } from "vue-router";
import { useQueryClient } from "@tanstack/vue-query";

const { t } = useI18n();
const authStore = useAuthStore();
const router = useRouter();
const queryClient = useQueryClient();

const { data: user } = useUserQuery();

const handleLogout = () => {
    authStore.logout();
    queryClient.clear(); // Clear all cache on logout
    router.push("/login");
};
</script>

<template>
    <nav class="bg-white shadow-sm border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16 items-center">
                <div class="flex items-center">
                    <router-link
                        to="/"
                        class="text-2xl font-bold text-blue-600"
                    >
                        NotesApp
                    </router-link>
                </div>

                <div class="flex items-center gap-6">
                    <LanguageSwitcher />

                    <div class="flex items-center gap-4">
                        <template v-if="authStore.isAuthenticated">
                            <span class="text-sm text-gray-700 hidden sm:block">
                                {{ user?.email }}
                            </span>
                            <UiButton variant="ghost" @click="handleLogout">
                                {{ t("auth.logout") }}
                            </UiButton>
                        </template>
                        <template v-else>
                            <router-link to="/login">
                                <UiButton variant="ghost">{{
                                    t("auth.login.title")
                                }}</UiButton>
                            </router-link>
                            <router-link to="/register">
                                <UiButton variant="primary">{{
                                    t("auth.register.title")
                                }}</UiButton>
                            </router-link>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>
