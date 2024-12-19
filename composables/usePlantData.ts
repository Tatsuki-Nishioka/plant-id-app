import type { Plant, CharacterSet, Character } from '~/types/plant'
import characters from '~/static/characters.json'
import master from '~/static/master.json'

export function usePlantData() {
  const plants = ref<Plant[]>([])
  // const families = ref<Family[]>([]);
  const characterSet = ref<CharacterSet>({})
  const isDataLoaded = ref(false)

  // データの読み込み
  const loadPlantData = () => {
    if (isDataLoaded.value) return

    // 特徴セットを読み込む
    characters.forEach((record) => {
      const character: Character = {
        id: record.id,
        character: record.character,
        characterJpn: record.character_jpn,
        category: record.category,
        categoryJpn: record.category_jpn,
      }
      characterSet.value[character.id] = character
    })

    // 植物データを読み込む
    master.forEach((record) => {
      if (record.scientific_name && record.characters.length) {
        const plant: Plant = {
          scientificName: record.scientific_name,
          japaneseName: null,
          family: record.family,
          genus: record.genus.trim() || null,
          species: record.species.trim() || null,
          characters: record.characters as string[],
        }
        plants.value.push(plant)
      }
    })

    isDataLoaded.value = true
  }

  // 名前検索
  const searchByName = (name: string): Plant[] => {
    return plants.value.filter(plant => plant.scientificName.includes(name))
  }

  // 特徴検索
  const searchByCharacters = (characters: string[]): Plant[] => {
    return plants.value.filter(plant => characters.every(f => plant.characters.includes(f)))
  }

  onMounted(() => {
    // データを読み込む
    loadPlantData()
  })

  return {
    plants: plants,
    characterSet: characterSet,
    loadPlantData,
    searchByName,
    searchByCharacters,
  }
}
