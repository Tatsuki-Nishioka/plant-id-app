<template>
  <div
    v-if="isVisible"
    class="modal-overlay"
    @click.self="close"
  >
    <div class="modal-content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  characterKey: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const isVisible = ref(props.modelValue)

const close = () => {
  isVisible.value = false
  emit('update:modelValue', false)
}

watch(() => props.modelValue, (newValue) => {
  isVisible.value = newValue
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  position: relative;
  max-width: 500px;
  width: 100%;
}

.modal-close {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}
</style>
