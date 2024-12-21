<template>
    <div v-if="isVisible" class="modal-overlay" @click.self="close">
        <div class="modal-content">
            <h3>{{ title }}</h3>
            <p>{{ content }}</p>
            <button @click="close">閉じる</button>
        </div>
    </div>
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


/* メディアクエリを使用してレスポンシブ対応 */
@media (min-width: 600px) {
  .modal-content {
    width: 80%; /* 600px以上の画面幅では80%に設定 */
  }
}

@media (min-width: 768px) {
  .modal-content {
    width: 70%; /* 768px以上の画面幅では70%に設定 */
  }
}

@media (min-width: 1024px) {
  .modal-content {
    width: 60%; /* 1024px以上の画面幅では60%に設定 */
  }
}

@media (min-width: 1280px) {
  .modal-content {
    width: 50%; /* 1280px以上の画面幅では50%に設定 */
  }
}
</style>