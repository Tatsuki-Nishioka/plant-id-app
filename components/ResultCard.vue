<template>
    <div class="result-card">
        <div class="family-name">{{ getFamilyName() }}</div>
        <div class="card-container">
            <div class="header" @click="toggleDetails">
                <h4>{{ plant.scientificName }}</h4>
                <span class="toggle-icon">{{ showDetails ? '▲' : '▼' }}</span>
            </div>
            <ul v-if="showDetails">
                <li class="plant-name">{{ getJapaneseName() }}</li>
                <li v-for="key in plant.characters" :key="key" class="character-item" @click="showModal(key)">
                    <span class="character-key">{{ key }}</span>
                    <span class="character-colon">：</span>
                    <span class="character-value">{{ characterSet[key]?.characterJpn }}</span>
                    <span class="character-info-button">ⓘ</span>
                </li>
            </ul>
        </div>
        <CharacterModal v-model:model-value="isModalVisible" :title="modalTitle" :content="modalContent" />
    </div>
</template>

<script setup lang="ts">
import type { Plant } from '~/types/plant';

const props = defineProps<{
    plant: Plant;
}>();

// マスタデータの取得
const characterSet = usePlantData().characterSet;

// 画面の表示内容と制御
const showDetails = ref(false);
const isModalVisible = ref(false);
const modalTitle = ref('');
const modalContent = ref('');

const getFamilyName = () => {
    if (props.plant.genus === '') return props.plant.familyJpn || '　';
    return props.plant.family;
};

const getJapaneseName = () => {
    if (props.plant.genus === '' || (props.plant.familyJpn === '' && props.plant.genusJpn === '')) return '';
    return (props.plant.familyJpn || '-') + ' / ' + (props.plant.genusJpn || '-');
};

const toggleDetails = (): void => {
    showDetails.value = !showDetails.value;
};

const showModal = (key: string) => {
    modalTitle.value = key + ". " + characterSet.value[key]?.characterJpn;
    modalContent.value = characterSet.value[key]?.characterDetailJpn ?? '詳細情報がありません';
    isModalVisible.value = true;
};
</script>

<style scoped>
.result-card {
    flex-direction: column;
    border: 1px solid #ccc;
    padding: 0 1rem 0.75rem;
    border-radius: 8px;
    background-color: #fff;
    cursor: pointer;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.05);
    /* 影を追加 */
    transition: box-shadow 0.3s ease;
    /* 影のトランジションを追加 */
    margin-bottom: 0.125rem;
    /* 要素間の間隔を追加 */
    -webkit-tap-highlight-color: transparent;
    /* スマホでのクリック時の選択色を消す */
}

.result-card:hover {
    box-shadow: 0 8px 8px rgba(0, 0, 0, 0.075);
    /* ホバー時の影を追加 */
}

.family-name {
    font-size: 0.65rem;
    color: #666;
    place-self: flex-end;
    margin: 0.1rem 0.5rem 0 0;
}

.card-container {
    flex-direction: row;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.result-card h4 {
    font-size: 1rem;
    margin: 0;
}

.toggle-icon {
    font-size: 0.5rem;
}

.plant-name {
    font-size: 0.75rem;
    color: #666;
    margin-bottom: 0.5rem;
    place-self: flex-end;
}

.result-card ul {
    margin: 0.25rem 0 0.5rem;
    padding-left: 0.25rem;
    font-size: 0.9rem;
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