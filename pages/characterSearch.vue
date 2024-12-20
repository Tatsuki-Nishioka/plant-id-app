<template>
    <div>
        <ProgressBar
            :current-step="currentStep" :total-steps="questions?.length"
            :filtered-count="filteredPlants.length" />
        <FilterPanel
            v-if="currentStep < questions?.length" :category="currentCategory" :first-category="firstCategory"
            :step-count="currentCategoryStepCount" :question="questions[currentStep]"
            @select="handleAnswer" @prev="prevQuestion" @next="nextQuestion" @skip="skipCategory" @show-results="showResults" />
        <div v-else>
            <div class="results-header">
                <h2>結果</h2>
                <button class="reset-button" @click="resetSearch">もう一度検索する</button>
            </div>
            <div v-for="plant in filteredPlants" :key="plant.scientificName">
                <ResultCard :character-set="characterSet" :plant="plant" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import ProgressBar from "~/components/ProgressBar.vue";
import FilterPanel from "~/components/FilterPanel.vue";
import ResultCard from "~/components/ResultCard.vue";
import type { Question, Answer } from "~/types/characterSearch";

const plantData = usePlantData();
plantData.loadPlantData();

const plants = plantData.plants;
const characterSet = plantData.characterSet;
// FilterPanel.vueの初期値用カテゴリ名
const firstCategory = characterSet.value["1"].categoryJpn;

const currentStep = ref(0);
// 特徴名の配列;
const questions = ref<Question[]>([]);
// key:カテゴリ_日本語, value:質問
const categories = ref<Map<string, Question[]>>(new Map());

// カテゴリと質問を作成
Object.entries(characterSet.value).forEach(([key, character]) => {
    const category = character.categoryJpn;
    const question = {
        category: category,
        key: key,
        text: character.characterJpn
    } as Question;

    const tmp = categories.value.get(category) ?? [] as Question[];
    tmp.push(question);

    categories.value.set(category, tmp);
    questions.value.push(question);
});

const currentCategory = computed(() => {
    return questions.value[currentStep.value].category;
});

const currentCategoryStepCount = computed(() => {
    return categories.value.get(currentCategory.value)?.length || 0;
});

// 回答から植物のリストをフィルタリング
const filteredPlants = computed(() => {
    const trueKeys: string[] = [];
    const falseKeys: string[] = [];
    useAnswers().answers.value.forEach((answer, key) => {
        if (answer === true) {
            trueKeys.push(key);
        } else if (answer === false) {
            falseKeys.push(key);
        }
    });

    return plants.value.filter(plant => {
        // すべてのtrueキーを含んでいるかつ、falseキーを含んでいない
        const hasAllTrueKeys = trueKeys.every(key => plant.characters.includes(key));
        const hasNoFalseKeys = !falseKeys.some(key => plant.characters.includes(key));
        return hasAllTrueKeys && hasNoFalseKeys;
    });
});

const handleAnswer = (answer: Answer) => {
    useAnswers().setAnswer(answer.key, answer.value);
    currentStep.value++;
};

const skipCategory = (skipAnswers: Answer[]) => {
    // カテゴリー全体をスキップ
    const range = categories.value.get(currentCategory.value)?.map(q => q.key) ?? [];
    useAnswers().skipRange(range, skipAnswers);

    currentStep.value = useAnswers().answers.value.size;
};

const showResults = () => {
    currentStep.value = questions.value.length;
};

const resetSearch = () => {
    currentStep.value = 0;
    useAnswers().resetAnswers();
};

const prevQuestion = () => {
    if (currentStep.value > 0) {
        currentStep.value--;
    }
};

const nextQuestion = () => {
    if (currentStep.value < questions.value.length - 1) {
        currentStep.value++;
    }
};

</script>

<style scoped>
.results-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.reset-button {
    padding: 0.5rem 1rem;
    border: none;
    background-color: #4caf50;
    color: white;
    cursor: pointer;
    border-radius: 4px;
}

.reset-button:hover {
    background-color: #66bb6a;
}
</style>
