<script setup lang="ts">
import { useI18n } from "vue-i18n";
import BaseLayout from "@/app/layouts/BaseLayout.vue";
import { RegisterForm } from "@/features/auth";
import { UiCard } from "@/shared/ui";
import { useAuthStore } from "@/entities/user";
import { watchEffect } from "vue";
import { useRouter } from "vue-router";

const { t } = useI18n();
const authStore = useAuthStore();
const router = useRouter();

watchEffect(() => {
    if (authStore.isAuthenticated) {
        router.push("/");
    }
});
</script>

<template>
    <BaseLayout>
        <div class="max-w-md mx-auto mt-12">
            <UiCard
                :title="t('auth.register.title')"
                :subtitle="t('auth.register.title')"
            >
                <RegisterForm />
                <template #footer>
                    <div class="text-center text-sm text-gray-500">
                        {{ t("auth.haveAccount") }}
                        <router-link
                            to="/login"
                            class="text-blue-600 hover:underline font-medium"
                        >
                            {{ t("auth.login.title") }}
                        </router-link>
                    </div>
                </template>
            </UiCard>
        </div>
    </BaseLayout>
</template>
