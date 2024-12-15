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
    padding: 1rem;
    margin-bottom: 1rem;
    background-color: #f9f9f9;
}

.icon {
    font-size: 2rem;
    margin-right: 1rem;
}

.description {
    font-size: 1rem;
}
</style>