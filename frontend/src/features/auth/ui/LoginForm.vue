<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { UiInput, UiButton } from "@/shared/ui";
import { useLoginMutation } from "../api/useLoginMutation";

const { t } = useI18n();
const email = ref("");
const password = ref("");
const errorMessage = ref("");

const { mutate: login, isPending } = useLoginMutation();

const handleSubmit = async () => {
    errorMessage.value = "";
    login(
        { email: email.value, password: password.value },
        {
            onError: (e: any) => {
                errorMessage.value =
                    e.response?.data?.message || t("auth.login.error");
            },
        },
    );
};
</script>

<template>
    <form @submit.prevent="handleSubmit" class="space-y-4">
        <UiInput
            v-model="email"
            type="email"
            :label="t('auth.fields.email.label')"
            :placeholder="t('auth.fields.email.placeholder')"
            required
            :disabled="isPending"
        />
        <UiInput
            v-model="password"
            type="password"
            :label="t('auth.fields.password.label')"
            :placeholder="t('auth.fields.password.placeholder')"
            required
            :disabled="isPending"
        />
        <div v-if="errorMessage" class="text-sm text-red-500">
            {{ errorMessage }}
        </div>
        <UiButton
            type="submit"
            variant="primary"
            class="w-full"
            :disabled="isPending"
        >
            {{
                isPending ? t("auth.login.submitting") : t("auth.login.submit")
            }}
        </UiButton>
    </form>
</template>
