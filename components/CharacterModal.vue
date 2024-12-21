<template>
    <Transition name="fade">
        <div v-if="isVisible" class="modal-overlay" @click.self="close">
            <div class="modal-content">
                <h3>{{ title }}</h3>
                <p>{{ content }}</p>
                <button @click="close">閉じる</button>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
const props = defineProps<{
    modelValue: boolean;
    title: string;
    content: string;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
}>();

const isVisible = ref(props.modelValue);

const close = () => {
    isVisible.value = false;
    emit('update:modelValue', false);
};

watch(() => props.modelValue, (newValue) => {
    isVisible.value = newValue;
});
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
    max-width: 500px;
    width: 80%;
}

.modal-content h3 {
    margin: 0;
    font-weight: bold;
    color: #333;
    text-align: center;
    border-bottom: 1.5px solid #ccc; /* 下線を追加 */
    padding-bottom: 0.25rem; /* 下線とテキストの間にスペースを追加 */
}

.modal-content p {
    margin: 1rem 0;
    font-size: 0.9rem;
    color: #666;
}

button {
    float: right;
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    right: 0.5rem;
}

button:hover {
    background-color: #45a049;
}

/* フェードイン・フェードアウトのトランジション */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.15s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0.7;
}
</style>