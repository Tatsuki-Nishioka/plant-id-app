import type { Plant, CharacterSet, Character } from '~/types/plant';
import characters from '~/static/characters.json';
import master from '~/static/master.json';

export function usePlantData() {
    const plants = useState<Plant[]>('plants', () => [])
    const characterSet = useState<CharacterSet>('characterSet', () => ({}))
    const isDataLoaded = useState<boolean>('isDataLoaded', () => false)

    // データの読み込み
    const loadPlantData = () => {
        if (isDataLoaded.value) return;

        // 特徴セットを読み込む
        characters.forEach((record) => {
            const character: Character = {
                id: record.id,
                character: record.character,
                characterJpn: record.character_jpn,
                category: record.category,
                categoryJpn: record.category_jpn,
            };
            characterSet.value[character.id] = character;
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

    onMounted(() => {
        // データを読み込む
        loadPlantData();
    });

    return {
        plants: plants,
        characterSet: characterSet,
        loadPlantData,
        searchByName,
        searchByCharacters,
    };
}