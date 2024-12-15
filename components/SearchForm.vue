<template>
  <div>
    <input
      type="text"
      v-model="query"
      placeholder="特徴を学名から検索"
      @input="filterResults"
    />
    <ul v-if="query && filteredResults.length">
      <li
        v-for="result in filteredResults"
        :key="result.scientificName"
        @click="selectPlant(result)"
      >
        {{ result.scientificName }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { Plant } from "~/types/plant";

const props = defineProps<{
  plants: Plant[];
}>();

const emit = defineEmits<{
  (e: "select", plant: Plant): void;
}>();

const query = ref("");
const filteredResults = ref(props.plants);
const maxResults = ref(10); // デフォルトの最大表示数

const filterResults = () => {
  filteredResults.value = props.plants.filter((plant) =>
    plant.scientificName.toLowerCase().includes(query.value.toLowerCase())
  );
};

const selectPlant = (plant: Plant) => {
  emit("select", plant);
};

// props.plantsが変更されたときにfilteredResultsを更新
watch(
  () => props.plants,
  (newPlants) => {
    filteredResults.value = newPlants;
  }
);

const adjustMaxResults = () => {
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
