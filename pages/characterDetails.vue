<template>
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
                <div
                    v-for="character in charactersMap.get(category.category) ?? []" :key="character.label"
                    class="card">
                    <div class="accordion-header" @click="toggle(character)">
                        <p>{{ character.label }}</p>
                        <span class="toggle-icon-child">{{ character.isOpen ? '▲' : '▼' }}</span>
                    </div>
                    <div v-if="character.isOpen" class="accordion-content">
                        <p>{{ character.content }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

type Item = {
    category: string;
    label: string;
    content: string;
    isOpen?: boolean;
};

const characterSet = usePlantData().characterSet;
const charactersMap = ref(new Map<string, Item[]>());
const categoryList = ref<Item[]>([]);
let count = 0
Object.entries(characterSet.value).forEach(([_key, character]) => {
    const temp: Item = {
        category: character.categoryJpn,
        label: character.id + '. ' + character.characterJpn,
        content: 'ここに説明がいっぱいはいります',
        isOpen: false,
    };
    const items = charactersMap.value.get(character.categoryJpn) || [];
    items.push(temp);
    charactersMap.value.set(character.categoryJpn, items);

    if (!categoryList.value.some(c => c.category === character.categoryJpn)) {
        const labelText = 'カテゴリー' + ++count + '. ' + character.categoryJpn
        categoryList.value.push({
            category: character.categoryJpn,
            label: labelText,
            content: 'カテゴリの説明がここに入ります',
            isOpen: false,
        });
    }
});

const toggle = (item: Item) => {
    item.isOpen = !item.isOpen;
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

.toggle-icon-child {
    font-size: 0.5rem;
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
    margin-bottom: .25rem;
    margin-left: .25rem;
    margin-right: .25rem;
}

.accordion-content {
    padding: 0.25rem;
    border-top: 1px solid #ccc;
    color: gray;
}

.category-description {
    margin: .5rem 0 1rem;
    color: #66bb6a; /* 緑色の文字色 */
}

.card {
    margin-bottom: 0.125rem;
    border-radius: 4px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
    /* 影を追加 */
    transition: box-shadow 0.3s ease;;
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