<template>
    <div class="character-card">
        <!-- <div class="icon">{{ icon }}</div> -->
        <div class="description">{{ description }}</div>
    </div>
</template>

<script setup lang="ts">

const props = defineProps<{
    description: String
}>();

</script>

<style scoped>
.character-card {
    display: flex;
    align-items: center;
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 0.75rem;
    margin-bottom: 0.31rem;
    background-color: #f9f9f9;
}

.icon {
    font-size: 1rem;
    margin-right: 1rem;
}

.description {
    font-size: 0.8rem;
}
</style>