<template>
    <div>
        <ProgressBar :currentStep="currentStep" :totalSteps="questions.length" />
        <FilterPanel v-if="currentStep < questions.length" :question="questions[currentStep].text"
            :options="questions[currentStep].options" @select="handleAnswer" />
        <div v-else>
            <h2>結果</h2>
            <div v-for="plant in filteredPlants" :key="plant.name">
                <ResultCard :plant="plant" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ProgressBar from "~/components/ProgressBar.vue";
import FilterPanel from "~/components/FilterPanel.vue";
import ResultCard from "~/components/ResultCard.vue";
import plantsData from "~/static/plants-data.json";

export default defineComponent({
    components: { ProgressBar, FilterPanel, ResultCard },
    data() {
        return {
            currentStep: 0,
            answers: [] as boolean[],
            questions: [
                {
                    text: "葉の裏面に毛がありますか？",
                    options: [
                        { label: "はい", value: true, icon: "🌿" },
                        { label: "いいえ", value: false, icon: "🍃" },
                    ],
                },
                {
                    text: "縁が反り返っていますか？",
                    options: [
                        { label: "はい", value: true, icon: "🌱" },
                        { label: "いいえ", value: false, icon: "🌴" },
                    ],
                },
            ],
        };
    },
    computed: {
        filteredPlants() {
            return (plantsData as any[]).filter((plant) =>
                this.answers.every((answer, index) => {
                    const key = Object.keys(this.questions[index].options[0])[0];
                    return plant.features[key] === answer;
                })
            );
        },
    },
    methods: {
        handleAnswer(answer: boolean) {
            this.answers.push(answer);
            this.currentStep++;
        },
    },
});
</script>
