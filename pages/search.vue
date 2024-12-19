<template>
  <div>
    <SearchBar
      :plants="plants"
      @select="handleSelect"
    />

    <div
      v-if="selectedPlant"
      class="plant-details"
    >
      <h3>{{ selectedPlant.scientificName }}</h3>
      <div>
        <CharacterCard
          v-for="character in selectedCharacters"
          :key="character.id"
          :icon="'🔍'"
          :description="character.characterJpn"
        />
      </div>
      <button @click="clearSelection">
        戻る
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import CharacterCard from '../components/CharacterCard.vue'
import SearchBar from '~/components/SearchBar.vue'
import type { Plant } from '~/types/plant'

const plantData = usePlantData()
const plants = plantData.plants
const characterSet = plantData.characterSet

const selectedPlant = ref<Plant | null>(null)

const handleSelect = (plant: Plant) => {
  selectedPlant.value = plant
}

const clearSelection = () => {
  selectedPlant.value = null
}

const selectedCharacters = computed(() => {
  if (!selectedPlant.value || !characterSet.value) return []
  return selectedPlant.value.characters.map(
    characterId => characterSet.value[characterId],
  )
})
</script>

<style scoped>
.plant-details {
    margin-top: 0.5rem;
}

button {
    padding: 0.5rem 1rem;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    margin-top: 0.25em;
    cursor: pointer;
}

button:hover {
    background-color: #45a049;
}
</style>
