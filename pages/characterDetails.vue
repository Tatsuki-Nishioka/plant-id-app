<template>
  <UContainer>
    <h1>カテゴリーと特徴一覧</h1>
    <UAccordion
      :items="[...categoryMap.values()]"
      size="xl"
    >
      <template #item="{ item }">
        <UCard>
          <template #header>
            <p>{{ item.content }}</p>
          </template>
          <template #default>
            <UAccordion
              color="gray"
              variant="ghost"
              size="md"
              :items="charactersMap.get(item.category) ?? []"
            />
          </template>
        </UCard>
      </template>
    </UAccordion>
  </UContainer>
</template>

<script setup lang="ts">
type item = {
  category?: string
  label: string
  content: string
}
const characterSet = usePlantData().characterSet
const charactersMap = new Map<string, item[]>()
const categoryMap = new Map<string, item>()
let count = 0
Object.entries(characterSet.value).forEach(([_key, character]) => {
  const temp: item = {
    category: character.categoryJpn,
    label: character.id + '. ' + character.characterJpn,
    content: 'ここに説明がいっぱいはいります',
  }
  const items = charactersMap.get(character.categoryJpn) || []
  items.push(temp)
  charactersMap.set(character.categoryJpn, items)

  if (!categoryMap.has(character.categoryJpn)) {
    const labelText = 'カテゴリー' + ++count + '. ' + character.categoryJpn
    categoryMap.set(character.categoryJpn, {
      category: character.categoryJpn,
      label: labelText,
      content: 'ここに説明がいっぱいはいります',
    })
  }
})
</script>
