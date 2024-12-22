import type { Plant, CharacterSet, Character, CategorySet, Category } from '~/types/plant';
import characters from '~/static/characters.json';
import categoryData from '~/static/categories.json';
import master from '~/static/master.json';

export function usePlantData() {
    const plants = useState<Plant[]>('plants', () => [])
    const characterSet = useState<CharacterSet>('characterSet', () => ({}))
    const categorySet = useState<CategorySet>('categorySet', () => ({}))
    const isDataLoaded = useState<boolean>('isDataLoaded', () => false)

    // データの読み込み
    const loadPlantData = () => {
        if (isDataLoaded.value) return;

        // 特徴セットを読み込む
        characters.forEach((character: Character) => {
            characterSet.value[character.id] = character;
        })

        // カテゴリを読み込む
        categoryData.forEach((category: Category) => {
            categorySet.value[category.id] = category;
        })

        // 植物データを読み込む
        plants.value = master as Plant[];

        isDataLoaded.value = true;
    }

    // 名前検索
    const searchByName = (name: string): Plant[] => {
        return plants.value.filter(plant => plant.scientificName.includes(name));
    };

    // 特徴検索
    const searchByCharacters = (characters: string[]): Plant[] => {
        return plants.value.filter(plant => characters.every(f => plant.characters.includes(f)));
    };

    return {
        plants: plants,
        characterSet: characterSet,
        categorySet: categorySet,
        loadPlantData,
        searchByName,
        searchByCharacters,
    };
}