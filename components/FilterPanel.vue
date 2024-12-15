<template>
    <div class="filter-panel">
        <div class="category-container">
            <h2 class="category">{{ category }} <span class="step-count">（{{ stepCount }} ステップ）</span></h2>
            <div class="question-container">
                <h3 class="question">{{ question.text }}</h3>
                <div class="options">
                    <button v-for="option in options" :key="option.label" class="option-card"
                        :class="{ selected: selectedOption?.value === option.value }"
                        @click="selectOption(option.value)">
                        <span class="icon">{{ option.icon }}</span>
                        <span class="label">{{ option.label }}</span>
                    </button>
                </div>
            </div>
            <button class="skip-button" @click="skipCategory">カテゴリをすべてスキップ</button>
            <button class="result-button" @click="showResults">結果を見る</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Question, Answer } from '~/pages/index.vue';

const props = defineProps<{
    category: string;
    question: Question;
    stepCount: number;
}>();

const emit = defineEmits<{
    (e: 'select', value: Answer): void;
    (e: 'skip'): void;
    (e: 'show-results'): void;
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

const skipCategory = () => {
    emit('skip');
};

const showResults = () => {
    emit('show-results');
};

</script>

<style scoped>
.filter-panel {
    text-align: center;
}

.category-container {
    background-color: #f0f0f0;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
}

.question-container {
    background-color: #ffffff;
    padding: 1rem;
    border-radius: 8px;
    margin-top: 1rem;
}

.options {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 1rem;
}

.option-card {
    padding: 0.5rem 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
}

.option-card.selected {
    background-color: #66bb6a;
    color: white;
}

.skip-button {
    padding: 0.5rem 1rem;
    border: none;
    background-color: #ffffff;
    cursor: pointer;
    border-radius: 4px;
    margin-top: 1rem;
    margin-right: 1rem;
    /* ボタン間のマージンを追加 */
}

.skip-button:hover {
    background-color: #e0e0e0;
}

.result-button {
    padding: 0.5rem 1rem;
    border: none;
    background-color: #4caf50;
    color: white;
    cursor: pointer;
    border-radius: 4px;
    margin-top: 1rem;
}

.result-button:hover {
    background-color: #66bb6a;
}

.step-count {
    font-size: 0.8rem;
    color: #666;
}
</style>