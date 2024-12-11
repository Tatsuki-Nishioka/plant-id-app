<template>
    <div>
        <input type="text" v-model="query" placeholder="植物の名前を検索" class="search-input" @input="filterResults" />
        <ul v-if="filteredResults.length" class="results-list">
            <li v-for="plant in filteredResults" :key="plant.name" @click="selectPlant(plant)" class="result-item">
                {{ plant.name }}
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from "vue";

export default defineComponent({
    props: {
        plants: {
            type: Array as PropType<{ name: string; features: Record<string, string> }[]>,
            required: true,
        },
    },
    emits: ["select"],
    setup(props, { emit }) {
        const query = ref("");
        const filteredResults = ref(props.plants);

        const filterResults = () => {
            filteredResults.value = props.plants.filter((plant) =>
                plant.name.toLowerCase().includes(query.value.toLowerCase())
            );
        };

        const selectPlant = (plant: { name: string; features: Record<string, string> }) => {
            emit("select", plant);
        };

        return {
            query,
            filteredResults,
            filterResults,
            selectPlant,
        };
    },
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