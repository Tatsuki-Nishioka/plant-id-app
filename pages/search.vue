<template>
    <div>
        <h1>植物の特徴検索</h1>
        <SearchBar :plants="plants" @select="handleSelect" />

        <div v-if="selectedPlant" class="plant-details">
            <h2>{{ selectedPlant.scientificName }}</h2>
            <div>
                <CharacterCard v-for="character in selectedCharacters" 
                    :key="character.id"
                    :icon="characterIcons[character.id] || '🔍'" 
                    :description="character.character_jpn" 
                />
            </div>
            <button @click="clearSelection">戻る</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import SearchBar from "~/components/SearchBar.vue";
import CharacterCard from "../components/CharacterCard.vue";
import { usePlantStore } from "~/store/plantStore";
import type { Character, Plant } from "~/types/plant";

const plants = usePlantStore().plants;
const charecterSet = usePlantStore().characterSet;
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
    if (!selectedPlant.value) return [];
    return selectedPlant.value.characters.map(
        (characterId) => charecterSet[characterId]
    );
});
</script>

<style scoped>
.plant-details {
    margin-top: 1rem;
}

button {
    padding: 0.5rem 1rem;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:hover {
    background-color: #45a049;
}
</style>