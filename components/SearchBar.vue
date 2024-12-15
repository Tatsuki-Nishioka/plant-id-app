<template>
    <div>
        <input type="text" v-model="query" placeholder="植物の名前を検索" class="search-input" @input="filterResults" />
        <ul v-if="filteredResults.length" class="results-list">
            <li v-for="plant in filteredResults" :key="plant.scientificName" @click="selectPlant(plant)"
                class="result-item">
                {{ plant.scientificName }}
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import type { Plant } from "~/types/plant";

// props と emit を定義
const props = defineProps<{
    plants: Plant[];
}>();

const emit = defineEmits<{
    (e: "select", plant: Plant): void;
}>();

// フィルタリング用のreactiveな変数と関数を定義
const query = ref("");
const filteredResults = ref(props.plants);

const filterResults = () => {
    filteredResults.value = props.plants.filter((plant) =>
        plant.scientificName.toLowerCase().includes(query.value.toLowerCase())
    );
};
const selectPlant = (plant: Plant) => {
    emit("select", plant);
};

// props.plants が変更されたときに結果をフィルタリング
watch(() => props.plants, filterResults);

</script>

<style scoped>
.search-input {
    width: 100%;
    padding: 0.5rem;
    font-size: 1rem;
    margin-bottom: 0.5rem;
}

.results-list {
    list-style: none;
    padding: 0;
    margin: 0;
    border: 1px solid #ccc;
    background: #fff;
}

.result-item {
    padding: 0.5rem;
    cursor: pointer;
}

.result-item:hover {
    background: #f0f0f0;
}
</style>