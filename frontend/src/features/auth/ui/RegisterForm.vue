<script setup lang="ts">
import { ref } from "vue";
import { UiInput, UiButton } from "@/shared/ui";
import { useRegisterMutation } from "../api/useRegisterMutation";

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
                    e.response?.data?.message || "Registration failed";
            },
        },
    );
};
</script>

<template>
    <form @submit.prevent="handleSubmit" class="space-y-4">
        <UiInput
            v-model="name"
            label="Name"
            placeholder="John Doe"
            required
            :disabled="isPending"
        />
        <UiInput
            v-model="email"
            type="email"
            label="Email"
            placeholder="your@email.com"
            required
            :disabled="isPending"
        />
        <UiInput
            v-model="password"
            type="password"
            label="Password"
            placeholder="••••••••"
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
            {{ isPending ? "Creating account..." : "Register" }}
        </UiButton>
    </form>
</template>
