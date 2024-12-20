<template>
    <div class="result-card">
        <div class="header" @click="toggleDetails">
            <h3>{{ plant.scientificName }}</h3>
            <span class="toggle-icon">{{ showDetails ? '▲' : '▼' }}</span>
        </div>
        <ul v-if="showDetails">
            <li v-for="key in plant.characters" :key="key" class="character-item">
                <span class="character-key">{{ key }}</span>
                <span class="character-value">：{{ characterSet[key]?.characterJpn }}</span>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import type { CharacterSet, Plant } from '~/types/plant';

defineProps<{
    plant: Plant;
    characterSet: CharacterSet;
}>();

const showDetails = ref(false);

const toggleDetails = (): void => {
    showDetails.value = !showDetails.value;
};
</script>

<style scoped>
.result-card {
    border: 1px solid #ccc;
    padding: 1rem;
    border-radius: 8px;
    background-color: #fff;
    cursor: pointer;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    /* 影を追加 */
    transition: box-shadow 0.3s ease;
    /* 影のトランジションを追加 */
    margin-bottom: 0.125rem;
    /* 要素間の間隔を追加 */
}

.result-card:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    /* ホバー時の影を追加 */
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.result-card h3 {
    margin: 0;
}

.toggle-icon {
    font-size: 0.75rem;
    margin-left: 0.5rem;
}

.result-card ul {
    margin-top: 1rem;
    padding-left: 1rem;
    list-style-type: none;
    /* デフォルトのリストスタイルを消す */
}

.character-item {
    display: flex;
    justify-content: space-between;
}

.character-key {
    flex: 0 0 3ch;
    /* 固定幅を設定してキーの位置を揃える */
}

.character-value {
    flex: 1;
}
</style>