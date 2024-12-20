<template>
  <div>
    <UCommandPalette
      v-model="selected"
      placeholder="特徴を学名から検索"
      :groups="groups"
    />
  </div>
</template>

<script setup lang="ts">
import type { Plant } from '~/types/plant'

type PlantCommand = {
  id: string
  label: string
  plant: Plant
}

// props と emit を定義
const props = defineProps<{
  plants: Plant[]
}>()

const emit = defineEmits<{
  (e: 'select', plant: Plant): void
}>()

// フィルタリング用のreactiveな変数と関数を定義
const filteredResults = ref([] as Plant[])
const selected = ref<PlantCommand>({} as PlantCommand)

watch(() => selected.value, (selection) => {
  emit('select', selection.plant)
})

const groups = [
  {
    key: 'plants',
    commands: props.plants.map((plant, id) => ({
      id,
      label: plant.scientificName,
      plant,
    })),
    filter: (query: string, commands: PlantCommand[]) => {
      if (query) {
        return commands.filter(plant =>
          plant.label.toLowerCase().includes(query.toLowerCase()),
        )
      }
      return []
    },
  },
]

// props.plantsが変更されたときにfilteredResultsを更新
watch(
  () => props.plants,
  (newPlants) => {
    filteredResults.value = newPlants
  },
)
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
