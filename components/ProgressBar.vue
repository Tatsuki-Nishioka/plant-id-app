<template>
    <div class="progress-bar">
        <div class="progress" :style="{ width: progress + '%' }"></div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    props: {
        currentStep: {
            type: Number,
            required: true,
        },
        totalSteps: {
            type: Number,
            required: true,
        },
    },
    computed: {
        progress() {
            return (this.currentStep / this.totalSteps) * 100;
        },
    },
});
</script>

<style scoped>
.progress-bar {
    height: 10px;
    background-color: #ddd;
    border-radius: 5px;
    overflow: hidden;
}

.progress {
    height: 100%;
    background-color: #4caf50;
    transition: width 0.3s ease;
}
</style>