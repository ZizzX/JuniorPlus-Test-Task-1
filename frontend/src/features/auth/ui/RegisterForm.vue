<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { UiInput, UiButton } from "@/shared/ui";
import { useRegisterMutation } from "../api/useRegisterMutation";

const { t } = useI18n();
const name = ref("");
const email = ref("");
const password = ref("");
const errorMessage = ref("");

const { mutate: register, isPending } = useRegisterMutation();

const handleSubmit = async () => {
    errorMessage.value = "";
    register(
        { name: name.value, email: email.value, password: password.value },
        {
            onError: (e: any) => {
                errorMessage.value =
                    e.response?.data?.message || t("auth.register.error");
            },
        },
    );
};
</script>

<template>
    <form @submit.prevent="handleSubmit" class="space-y-4">
        <UiInput
            v-model="name"
            :label="t('auth.fields.name.label')"
            :placeholder="t('auth.fields.name.placeholder')"
            required
            :disabled="isPending"
        />
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
                isPending
                    ? t("auth.register.submitting")
                    : t("auth.register.submit")
            }}
        </UiButton>
    </form>
</template>
