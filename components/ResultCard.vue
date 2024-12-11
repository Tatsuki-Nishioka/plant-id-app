<template>
    <div class="result-card">
        <h3>{{ plant.name }}</h3>
        <ul>
            <li v-for="(value, key) in plant.features" :key="key">
                {{ key }}: {{ value ? "Yes" : "No" }}
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    props: {
        plant: {
            type: Object as () => { name: string; features: Record<string, boolean> },
            required: true,
        },
    },
});
</script>

<style scoped>
.result-card {
    border: 1px solid #ccc;
    padding: 1rem;
    border-radius: 8px;
    background-color: #fff;
}
</style>