<template>
  <div class="progress-bar-container">
    <div class="progress-bar">
      <div
        class="progress"
        :style="{ width: progressWidth + '%' }"
      />
    </div>
    <div class="progress-info">
      <span>該当植物数: {{ filteredCount }}</span>
      <span>ステップ: {{ displayStep }} / {{ totalSteps }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  currentStep: number
  totalSteps: number
  filteredCount: number
}>()

const displayStep = computed(() => {
  return Math.min(props.currentStep + 1, props.totalSteps)
})

const progressWidth = computed(() => {
  return (props.currentStep / props.totalSteps) * 100
})
</script>

<style scoped>
.progress-bar {
  position: relative;
  height: 20px;
  background-color: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background-color: #76c7c0;
  transition: width 0.3s;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 0.8rem;
}
</style>
