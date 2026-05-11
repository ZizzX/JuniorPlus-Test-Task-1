<script setup lang="ts">
import { useI18n } from "vue-i18n";
import BaseLayout from "@/app/layouts/BaseLayout.vue";
import { NoteList } from "@/widgets/note-list";
import { CreateNoteForm } from "@/features/note-create";
import { UiCard } from "@/shared/ui";

const { t } = useI18n();
</script>

<template>
    <BaseLayout>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Create Sidebar -->
            <div class="md:col-span-1 space-y-6">
                <UiCard :title="t('notes.create.button')">
                    <CreateNoteForm />
                </UiCard>
            </div>

            <!-- Notes Feed -->
            <div class="md:col-span-2 space-y-6">
                <h2 class="text-2xl font-bold text-gray-900">
                    {{ t("notes.title") }}
                </h2>
                <NoteList />
            </div>
        </div>
    </BaseLayout>
</template>
