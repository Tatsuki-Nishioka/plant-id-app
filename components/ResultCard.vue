<template>
    <div class="result-card">
        <div class="header" @click="toggleDetails">
            <h4>{{ plant.scientificName }}</h4>
            <span class="toggle-icon">{{ showDetails ? '▲' : '▼' }}</span>
        </div>
        <ul v-if="showDetails">
            <li v-for="key in plant.characters" :key="key" class="character-item" @click="showModal(key)">
                <span class="character-key">{{ key }}</span>
                <span class="character-colon">：</span>
                <span class="character-value">{{ characterSet[key]?.characterJpn }}</span>
                <span class="character-info-button">ⓘ</span>
            </li>
        </ul>
        <CharacterModal v-model:model-value="isModalVisible" :title="modalTitle" :content="modalContent" />
    </div>
</template>

<script setup lang="ts">
import type { CharacterSet, Plant } from '~/types/plant';

const props = defineProps<{
    plant: Plant;
    characterSet: CharacterSet;
}>();

const showDetails = ref(false);
const isModalVisible = ref(false);
const modalTitle = ref('');
const modalContent = ref('');

const toggleDetails = (): void => {
    showDetails.value = !showDetails.value;
};

const showModal = (key: string) => {
    modalTitle.value = key + ". " + props.characterSet[key]?.characterJpn;
    modalContent.value = usePlantData().characterSet.value[key]?.characterDetailJpn ?? '詳細情報がありません';
    isModalVisible.value = true;
};
</script>

<style scoped>
.result-card {
    border: 1px solid #ccc;
    padding: 1rem;
    border-radius: 8px;
    background-color: #fff;
    cursor: pointer;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.05);
    /* 影を追加 */
    transition: box-shadow 0.3s ease;
    /* 影のトランジションを追加 */
    margin-bottom: 0.125rem;
    /* 要素間の間隔を追加 */
    -webkit-tap-highlight-color: transparent; /* スマホでのクリック時の選択色を消す */
}

.result-card:hover {
    box-shadow: 0 8px 8px rgba(0, 0, 0, 0.075);
    /* ホバー時の影を追加 */
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.result-card h4 {
    margin: 0;
}

.toggle-icon {
    font-size: 0.75rem;
    margin-left: 0.5rem;
}

.result-card ul {
    margin-top: 1rem;
    padding-left: 0.25rem;
    list-style-type: none;
    /* デフォルトのリストスタイルを消す */
}

.character-item {
    display: flex;
    justify-content: space-between;
    padding-bottom: .25rem;
}

.character-key {
    flex: 0 0 3ch;
    /* 固定幅を設定してキーの位置を揃える */
    text-align: left;
}

.character-colon {
    text-align: left;
}

.character-value {
    flex: 1;
    margin-right: 0.5rem;
}

.character-info-button {
    background: none;
    border: none;
    color: gray;
    cursor: pointer;
    font-size: 1rem;
}
</style>