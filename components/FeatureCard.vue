<template>
    <div class="feature-card">
        <div class="icon">{{ icon }}</div>
        <div class="description">{{ description }}</div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    props: {
        icon: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
    },
});
</script>

<style scoped>
.feature-card {
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