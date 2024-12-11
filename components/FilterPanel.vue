<template>
    <div class="filter-panel">
        <h2 class="question">{{ question }}</h2>
        <div class="options">
            <button v-for="option in options" :key="option.value" class="option-card"
                @click="selectOption(option.value)">
                <span class="icon">{{ option.icon }}</span>
                <span class="label">{{ option.label }}</span>
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    props: {
        question: {
            type: String,
            required: true,
        },
        options: {
            type: Array as () => { label: string; value: boolean; icon: string }[],
            required: true,
        },
    },
    emits: ["select"],
    methods: {
        selectOption(value: boolean) {
            this.$emit("select", value);
        },
    },
});
</script>

<style scoped>
.filter-panel {
    text-align: center;
}

.options {
    display: flex;
    justify-content: center;
    gap: 1rem;
}

.option-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #f9f9f9;
    cursor: pointer;
}

.option-card:hover {
    background-color: #e0e0e0;
}

.icon {
    font-size: 2rem;
}

.label {
    margin-top: 0.5rem;
}
</style>