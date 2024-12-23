<template>
    <transition name="fade">
        <div v-if="isVisible" class="modal-overlay" @click.self="close">
            <div class="modal-content">
                <h3 class="modal-title">{{ title }}</h3>
                <div class="modal-body">
                    <!-- 特徴の詳細の場合 -->
                    <p v-if="typeof content === 'string'">{{ content }}</p>
                    <!-- 回答一覧の場合 -->
                    <ul v-else>
                        <li v-for="item in content" :key="item.key" class="list-item">
                            <span class="item-title">{{ item.key }}. {{ item.title }}</span>
                            <span class="item-answer">{{ item.answer }}</span>
                        </li>
                    </ul>
                </div>
                <button class="bottom-button" @click="close">閉じる</button>
            </div>
        </div>
    </transition>
</template>

<script setup lang="ts">
/**
 * 回答一覧用
 */
export type ModalContent = { key: string, title: string, answer: string };

const props = defineProps<{
    modelValue: boolean;
    title: string;
    content: string | ModalContent[];
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
    position: relative;
    background: white;
    padding: 1rem;
    border-radius: 8px;
    max-width: 500px;
    width: 80%;
    max-height: 80vh;
    /* ビューポートの高さの80%に制限 */
    display: flex;
    flex-direction: column;
}

.modal-title {
    margin: 0 0 0.5rem;
    font-weight: bold;
    text-align: center;
    color: #333;
    border-bottom: 2px solid #ccc;
    padding-bottom: 0.25rem;
    position: sticky;
    top: 0;
    background: white;
    z-index: 10;
}

.modal-body {
    overflow-y: auto;
    /* コンテンツが大きい場合にスクロール可能に */
    flex-grow: 1;
}

.modal-body p {
    margin: 0;
    font-size: 0.9rem;
    color: #666;
    line-height: 1.5;
    /* 文字列の高さを広げる */
}

.modal-body ul {
    margin: 0;
    padding: 0;
    list-style: none;
}

.modal-body li {
    display: flex;
    justify-content: space-between;
    /* 子要素を左右に配置 */
    margin: 0 2rem 0.5rem 0;
    line-height: 1.5;
    /* 文字列の高さを広げる */
    font-size: 0.9rem;
}

.bottom-button {
    float: right;
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.bottom-button:hover {
    background-color: #45a049;
}

/* フェードイン・フェードアウトのトランジション */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to

/* .fade-leave-active in <2.1.8 */
    {
    opacity: 0;
}
</style>