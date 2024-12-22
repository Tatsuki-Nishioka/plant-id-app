<template>
    <div>
        <div class="container">
            <div v-for="category in categoryList" :key="category.label" class="accordion">
                <div class="accordion-header-parent" @click="toggle(category)">
                    <p>{{ category.label }}</p>
                    <span class="toggle-icon">{{ category.isOpen ? '▲' : '▼' }}</span>
                </div>
                <div v-if="category.isOpen" class="accordion-content">
                    <div class="category-description">
                        <p>{{ category.content }}</p> <!-- カテゴリの説明を追加 -->
                    </div>
                    <div v-for="character in charactersMap.get(category.category) ?? []" :key="character.label"
                        class="card">
                        <div class="accordion-header" @click="showModal(character)">
                            <p>{{ character.label }}</p>
                            <span class="info-icon">ⓘ</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <CharacterModal v-model:model-value="isModalVisible" :title="modalTitle" :content="modalContent" />
    </div>
</template>

<script setup lang="ts">

type Item = {
    category: string;
    label: string;
    content: string;
    isOpen: boolean;
};

const characterSet = usePlantData().characterSet;
const categorySet = usePlantData().categorySet;
const charactersMap = ref(new Map<string, Item[]>());
const categoryList = ref<Item[]>([]);
// モーダルの表示状態
const isModalVisible = ref(false);
const modalTitle = ref('');
const modalContent = ref('');

Object.entries(characterSet.value).forEach(([_key, character]) => {
    const temp: Item = {
        category: categorySet.value[character.categoryId].categoryJpn,
        label: character.id + '. ' + character.characterJpn,
        content: character.characterDetailJpn,
        isOpen: false,
    };
    const categoryJpn = categorySet.value[character.categoryId].categoryJpn;
    const items = charactersMap.value.get(categoryJpn) || [];
    items.push(temp);
    charactersMap.value.set(categoryJpn, items);
});

Object.entries(categorySet.value).forEach(([_key, category]) => {
    categoryList.value.push({
        category: category.categoryJpn,
        label: category.id + '. ' + category.categoryJpn,
        content: category.detailJpn,
        isOpen: false,
    });
});

const toggle = (item: Item) => {
    item.isOpen = !item.isOpen;
};

// モーダルの内容作成・表示
const showModal = (item: Item) => {
    isModalVisible.value = true;

    modalTitle.value = item.label;
    modalContent.value = item.content;
};
</script>

<style scoped>
.container {
    padding: .1rem;
}

.container h3 {
    margin: 0.5rem 0 0.5rem;
}

.accordion {
    border: 1px solid #ccc;
    padding: 1rem;
    padding-bottom: 0;
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

.accordion:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    /* ホバー時の影を追加 */
}

.accordion p {
    margin: 0;
}

.toggle-icon {
    font-size: 0.75rem;
    margin-left: 0.5rem;
}

.info-icon {
    font-size: 1rem;
    margin-right: 0.5rem;
}

.accordion-header-parent {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    color: #66bb6a;
}

.accordion-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 .25rem .25rem;
    padding: 0.25rem 0;
}

.accordion-content {
    padding: 0.25rem;
    border-top: 1px solid #ccc;
    color: gray;
}

.category-description {
    margin: .5rem 0 1rem;
    color: #66bb6a;
    /* 緑色の文字色 */
}

.card {
    margin-bottom: 0.125rem;
    border-radius: 4px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
    /* 影を追加 */
    transition: box-shadow 0.3s ease;
    ;
}

.card p {
    margin: .25rem;
}

.card-header {
    padding: 0.25rem;
    background-color: #e0e0e0;
}

.card-content {
    padding: 0.25rem;
}
</style>