<template>
    <div>
        <ProgressBar
            :current-step="currentStep" :total-steps="questions?.length"
            :filtered-count="filteredPlants.length" />
        <FilterPanel
            v-if="currentStep < questions?.length" :category="currentCategory" :first-category="firstCategory"
            :step-count="currentCategoryStepCount" :question="questions[currentStep]" @select="handleAnswer"
            @prev="prevQuestion" @next="nextQuestion" @skip="skipCategory" @show-results="showResults" />
        <div v-else>
            <div class="results-header">
                <div class="tabs">
                    <input id="radio-1" v-model="selectedTaxa" type="radio" value="all">
                    <label class="tab" for="radio-1">すべて</label>
                    <input id="radio-2" v-model="selectedTaxa" type="radio" value="family">
                    <label class="tab" for="radio-2">科</label>
                    <input id="radio-3" v-model="selectedTaxa" type="radio" value="genus">
                    <label class="tab" for="radio-3">属</label>
                    <input id="radio-4" v-model="selectedTaxa" type="radio" value="species">
                    <label class="tab" for="radio-4">種</label>
                    <span class="glider"/>
                </div>
                <button class="reset-button" @click="resetSearch">もう一度検索する</button>
            </div>
            <div v-for="plant in filteredPlants" :key="plant.scientificName">
                <ResultCard :plant="plant" />
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

const characterSet = plantData.characterSet;
const categorySet = plantData.categorySet;
// FilterPanel.vueの初期値用カテゴリ名
const firstCategory = categorySet.value["1"].categoryJpn;

const currentStep = ref(0);
// 特徴名の配列;
const questions = ref<Question[]>([]);
// key:カテゴリ_日本語, value:質問
const categories = ref<Map<string, Question[]>>(new Map());
// 結果の表示分類群
const selectedTaxa = ref<string>('all');

// カテゴリと質問を作成
Object.entries(characterSet.value).forEach(([key, character]) => {
    const category = categorySet.value[character.categoryId].categoryJpn;
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
const taxa = computed(() => {
    const trueKeys: string[] = [];
    const falseKeys: string[] = [];
    useAnswers().answers.value.forEach((answer, key) => {
        if (answer === true) {
            trueKeys.push(key);
        } else if (answer === false) {
            falseKeys.push(key);
        }
    });

    const families = plantData.filterFamilies(trueKeys);
    const genera = plantData.filterGenera(trueKeys);
    const species = plantData.filterSpecies(trueKeys, falseKeys);
    const allTaxa = [...families, ...genera, ...species];

    return { families, genera, species, allTaxa };
});

// 結果画面の選択分類群を監視
const filteredPlants = computed(() => {
    switch (selectedTaxa.value) {
        case 'family':
            return taxa.value.families;
        case 'genus':
            return taxa.value.genera;
        case 'species':
            return taxa.value.species;
        case 'all':
        default:
            return taxa.value.allTaxa;
    }
});

// 結果を非表示時に表示分類群をリセット
watch(() => currentStep.value >= questions.value.length, (isResultsVisible) => {
    if (!isResultsVisible) {
        selectedTaxa.value = 'all';
    }
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
        const key = (currentStep.value + 1).toString();
        if (useAnswers().getAnswer(key) === undefined) { 
            useAnswers().setAnswer(key, null);
        }
        currentStep.value++;
    }
};

</script>

<style scoped>
.results-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0.5rem 0;
}

.reset-button {
    padding: 0.5rem 0.5rem;
    border: none;
    background-color: #4caf50;
    color: white;
    cursor: pointer;
    border-radius: 4px;
}

.reset-button:hover {
    background-color: #66bb6a;
}

/* From Uiverse.io by Pradeepsaranbishnoi */
.tabs {
    display: flex;
    position: relative;
    background-color: #fff;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.08);
    padding: 0.4rem 0.125rem;
    border-radius: 4px;
}

.tabs * {
    z-index: 2;
}

.tabs input[type="radio"] {
    display: none;
}

.tab {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 1.5rem;
    width: 2.5rem;
    font-size: .8rem;
    color: black;
    font-weight: 500;
    border-radius: 4px;
    cursor: pointer;
    transition: color 0.1s ease-in;
}

.tabs input[type="radio"]:checked+label {
    color: #4caf50;
}

.tabs input[id="radio-1"]:checked~.glider {
    transform: translateX(0);
}

.tabs input[id="radio-2"]:checked~.glider {
    transform: translateX(100%);
}

.tabs input[id="radio-3"]:checked~.glider {
    transform: translateX(200%);
}

.tabs input[id="radio-4"]:checked~.glider {
    transform: translateX(300%);
}

.glider {
    position: absolute;
    display: flex;
    height: 1.75rem;
    width: 2.5rem;
    background-color: #e6eef9;
    z-index: 1;
    border-radius: 4px;
    transition: 0.15s ease-out;
}

@media (max-width: 700px) {}
</style>
