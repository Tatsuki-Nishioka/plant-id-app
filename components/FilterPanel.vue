<template>
    <div class="filter-panel">
        <h2 class="question">{{ question.text }}</h2>
        <div class="options">
            <button v-for="option in options" :key="option.label" class="option-card"
                :class="{ selected: selectedOption?.value === option.value }" @click="selectOption(option.value)">
                <span class="icon">{{ option.icon }}</span>
                <span class="label">{{ option.label }}</span>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Question, Answer } from '~/pages/index.vue';

const props = defineProps<{
    question: Question;
}>();

const emit = defineEmits<{
    (e: 'select', value: Answer): void;
}>();

const selectedOption = ref<Answer | null>(null);

const options = [
    { label: "Yes", value: true, icon: "✔️" },
    { label: "No", value: false, icon: "❌" },
    { label: "Unknown", value: null, icon: "❔" },
];

const selectOption = (value: boolean | null) => {
    selectedOption.value = { key: props.question.key, value };
    emit('select', selectedOption.value);
};
</script>

<style scoped>
.filter-panel {
    text-align: center;
}

.options {
    display: flex;
    justify-content: center;
    gap: 1rem;
}

.option-card {
    padding: 0.5rem 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s, color 0.3s;
}

.option-card.selected {
    background-color: #007bff;
    color: white;
}
</style>