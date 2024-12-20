<template>
    <div>
        <input v-model="query" type="text" placeholder="特徴を学名から検索" class="search-input" @input="filterResults" >
        <ul v-if="query && filteredResults.length" class="results-list">
            <li
v-for="plant in filteredResults" :key="plant.scientificName" class="result-item"
                @click="selectPlant(plant)">
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
const filteredResults = ref([] as Plant[]);
const maxResults = ref(10); // デフォルトの最大表示数

const filterResults = (): void => {
  if (!query.value) {
    filteredResults.value = [];
    return;
  }

  filteredResults.value = props.plants.filter((plant) =>
    plant.scientificName.toLowerCase().includes(query.value.toLowerCase())
  );
};

const selectPlant = (plant: Plant): void => {
  emit("select", plant);
  filteredResults.value = [];
};

// props.plantsが変更されたときにfilteredResultsを更新
watch(
  () => props.plants,
  (newPlants) => {
    filteredResults.value = newPlants;
  }
);

const adjustMaxResults = (): void => {
  const itemHeight = 40; // 各リストアイテムの高さ（ピクセル）
  const availableHeight = window.innerHeight - 100; // 利用可能な高さ（ピクセル）
  maxResults.value = Math.floor(availableHeight / itemHeight);
};

onMounted(() => {
  window.addEventListener("resize", adjustMaxResults);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", adjustMaxResults);
});
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