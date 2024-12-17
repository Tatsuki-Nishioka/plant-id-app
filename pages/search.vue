<template>
    <div>
        <h2>名前から検索</h2>
        <SearchBar :plants="plants" @select="handleSelect" />

        <div v-if="selectedPlant" class="plant-details">
            <h3>{{ selectedPlant.scientificName }}</h3>
            <div>
                <CharacterCard v-for="character in selectedCharacters" 
                    :key="character.id"
                    :icon="characterIcons[character.id] || '🔍'" 
                    :description="character.characterJpn" 
                />
            </div>
            <button @click="clearSelection">戻る</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import SearchBar from "~/components/SearchBar.vue";
import CharacterCard from "../components/CharacterCard.vue";
// import { usePlantStore } from "~/store/plantStore";
import type { Character, Plant, CharacterSet } from "~/types/plant";

// const plants = usePlantStore().plants;
// const characterSet = usePlantStore().characterSet;
const plantService = usePlantService();
const plants = plantService.plants;
const characterSet = plantService.characterSet;

const selectedPlant = ref<Plant | null>(null);

const characterIcons: Record<string, string> = {
    has_hair: '🌿',
    revolute_margin: '🍃',
};

const handleSelect = (plant: Plant) => {
    selectedPlant.value = plant;
};

const clearSelection = () => {
    selectedPlant.value = null;
};

const selectedCharacters = computed(() => {
    if (!selectedPlant.value || !characterSet.value) return [];
    return selectedPlant.value.characters.map(
        (characterId) => characterSet.value[characterId]
    );
});
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