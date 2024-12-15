<template>
    <div class="result-card">
        <h3>{{ plant.scientificName }}</h3>
        <ul>
            <li v-for="(value, key) in plant.characters" :key="key">
                {{ key }}: {{ value ? "Yes" : "No" }}
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import type { Plant } from '~/types/plant';

const props = defineProps<{ 
    plant: Plant 
}>();

</script>

<style scoped>
.result-card {
    border: 1px solid #ccc;
    padding: 1rem;
    border-radius: 8px;
    background-color: #fff;
}
</style>