<template>
    <div>
        <h1>植物の特徴検索</h1>
        <SearchBar :plants="plants" @select="handleSelect" />

        <div v-if="selectedPlant" class="plant-details">
            <h2>{{ selectedPlant.name }}</h2>
            <div>
                <FeatureCard v-for="(description, key) in selectedPlant.features" :key="key"
                    :icon="featureIcons[key] || '🔍'" :description="description" />
            </div>
            <button @click="clearSelection">戻る</button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import SearchBar from "~/components/SearchBar.vue";
import FeatureCard from "~/components/FeatureCard.vue";
import plantsData from "~/static/plants-data.json";

export default defineComponent({
    components: { SearchBar, FeatureCard },
    setup() {
        const plants = plantsData as { name: string; features: Record<string, string> }[];
        const selectedPlant = ref<{ name: string; features: Record<string, string> } | null>(null);

        const featureIcons: Record<string, string> = {
            has_hair: "🌿",
            revolute_margin: "🍃",
        };

        const handleSelect = (plant: { name: string; features: Record<string, string> }) => {
            selectedPlant.value = plant;
        };

        const clearSelection = () => {
            selectedPlant.value = null;
        };

        return {
            plants,
            selectedPlant,
            featureIcons,
            handleSelect,
            clearSelection,
        };
    },
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