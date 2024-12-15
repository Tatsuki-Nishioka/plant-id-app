<template>
    <div>
        <ProgressBar :currentStep="currentStep" :totalSteps="questions?.length"
            :filteredCount="filteredPlants.length" />
        <FilterPanel v-if="currentStep < questions?.length" :category="currentCategory"
            :stepCount="currentCategoryStepCount" :question="questions[currentStep]" @select="handleAnswer"
            @skip="skipCategory" @show-results="showResults" />
        <div v-else>
            <div class="results-header">
                <h2>結果</h2>
                <button class="reset-button" @click="resetSearch">もう一度検索する</button>
            </div>
            <div v-for="plant in filteredPlants" :key="plant.scientificName">
                <ResultCard :characterSet="characterSet" :plant="plant" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import ProgressBar from "~/components/ProgressBar.vue";
import FilterPanel from "~/components/FilterPanel.vue";
import ResultCard from "~/components/ResultCard.vue";
import { usePlantService } from "~/composables/usePlantService";

export type Question = {
    category: string;
    key: string;
    text: string;
}
export type Answer = {
    key: string;
    value: boolean | null;
}

type AnswerMap = Map<string, boolean | null>;

// const plantStore = usePlantStore();
const plantService = usePlantService();
plantService.loadPlantData();

const plants = plantService.plants;
const characterSet = plantService.characterSet;

const currentStep = ref(0);
// 特徴に対する回答
const answers = ref<AnswerMap>(new Map());
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

// const currentQuestion = computed(() => categories.value.get(currentCategory.value)?.[0]);

// 回答から植物のリストをフィルタリング
const filteredPlants = computed(() => {
    const trueKeys: string[] = [];
    const falseKeys: string[] = [];
    answers.value.forEach((answer, key) => {
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
    answers.value.set(answer.key, answer.value);
    currentStep.value++;
};

const skipCategory = () => {
    // カテゴリー全体をスキップ
    categories.value.get(currentCategory.value)?.forEach(q => {
        answers.value.set(q.key, null);
    });
    currentStep.value = answers.value.size;
};

const showResults = () => {
    currentStep.value = questions.value.length;
};

const resetSearch = () => {
    currentStep.value = 0;
    answers.value = new Map();
};
</script>

<style scoped>
.results-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
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
