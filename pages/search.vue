<template>
    <div class="container">
        <SearchBar @select="handleSelect" />

        <div v-if="selectedPlant" class="plant-details">
            <ResultCard class="result-card" :plant="selectedPlant" />
            <button @click="clearSelection">戻る</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import SearchBar from "~/components/SearchBar.vue";
import ResultCard from "~/components/ResultCard.vue";
import type { Plant } from "~/types/plant";

const selectedPlant = ref<Plant | null>(null);

const handleSelect = (plant: Plant) => {
    selectedPlant.value = plant;
};

const clearSelection = () => {
    selectedPlant.value = null;
};

</script>

<style scoped>
.container h3{
    margin: 0.5rem 0 0.5rem;
}
.plant-details {
    margin-top: 0.5rem;
}

.result-card {
    position: relative;
    z-index: 1; /* ボタンより前に表示 */
}

button {
    position: fixed;
    bottom: 1rem;
    padding: 0.5rem 1rem;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    margin-top: 0.25em;
    cursor: pointer;
    z-index: 0;
}

button:hover {
    background-color: #45a049;
}
</style>