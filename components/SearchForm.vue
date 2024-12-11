<template>
    <div>
        <input type="text" v-model="query" placeholder="植物の名前を検索" @input="filterResults" />
        <ul v-if="filteredResults.length">
            <li v-for="result in filteredResults" :key="result.name" @click="select(result)">
                {{ result.name }}
            </li>
        </ul>
    </div>
</template>

<script>
import plantsData from '~/static/plants-data.json';

export default {
    data() {
        return {
            query: '',
            filteredResults: [],
        };
    },
    methods: {
        filterResults() {
            this.filteredResults = plantsData.filter((plant) =>
                plant.name.toLowerCase().includes(this.query.toLowerCase())
            );
        },
        select(plant) {
            this.$emit("select", plant);
        },
    },
};
</script>