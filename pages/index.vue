<template>
    <div>
        <ProgressBar :currentStep="currentStep" :totalSteps="questions?.length" />
        <FilterPanel v-if="currentStep < questions?.length" :question="questions[currentStep]"
            @select="handleAnswer" />
        <div v-else>
            <h2>結果</h2>
            <div v-for="plant in filteredPlants" :key="plant.scientificName">
                <ResultCard :plant="plant" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { usePlantStore } from "~/store/plantStore";
import ProgressBar from "~/components/ProgressBar.vue";
import FilterPanel from "~/components/FilterPanel.vue";
import ResultCard from "~/components/ResultCard.vue";

export type Question = {
    key: string;
    text: string;
}
export type Answer = {
    key: string;
    value: boolean | null;
}

const plantStore = usePlantStore();

const currentStep = ref(0);
const answers = ref<Answer[]>([]);
const questions: Question[] = [
    {
        key: "1",
        text: "葉の裏面に毛がありますか？",
    },
    {
        key: "2",
        text: "縁が反り返っていますか？",
    },
];

Object.entries(plantStore.characterSet).forEach(([key, character]) => {
    questions.push({
        key: key,
        text: character.character_jpn,
    });
});

const filteredPlants = computed(() => {
    // フィルタリングロジックを追加
    return plantStore.plants.filter(plant => {
        // ここにフィルタリング条件を追加
        return true; // 仮の条件
    });
});

const handleAnswer = (answer: Answer) => {
    answers.value.push(answer);
    currentStep.value++;
    console.log(answers.value);
};
</script>
