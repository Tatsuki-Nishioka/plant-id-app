import type { Plant, CharacterSet, Character } from '~/types/plant';
import plantsData from '~/static/plants-data.json';
import characters from '~/static/characters.json';
import data227 from '~/static/227.json';
import master from '~/static/master.json';

export function usePlantData() {
    const plants = ref<Plant[]>([]);
    // const families = ref<Family[]>([]);
    const characterSet = ref<CharacterSet>({});
    const isDataLoaded = ref(false);

    // データの読み込み
    const loadPlantData = () => {
        if (isDataLoaded.value) return;

        const data = plantsData as any; // JSONデータの型をanyとして読み込む

        // 特徴セットを読み込む
        characters.forEach((record: any) => {
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
        master.forEach((record: any) => {
            if (record.scientific_name && record.characters?.length) {
                const plant: Plant = {
                    scientificName: record.scientific_name,
                    japaneseName: record?.japanese_name || null,
                    family: record.family,
                    genus: record.genus.trim() || null,
                    species: record.species.trim() || null,
                    characters: record.characters,
                };
                plants.value.push(plant);
            }
        })

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
        // plants: readonly(plants),
        // // families: readonly(families),
        // characterSet: readonly(characterSet),
        plants: plants,
        characterSet: characterSet,
        loadPlantData,
        searchByName,
        searchByCharacters,
    };
}