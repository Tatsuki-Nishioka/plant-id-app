import type { Plant, CharacterSet, Character, CategorySet, Category } from '~/types/plant';
import characters from '~/static/characters.json';
import categoryData from '~/static/categories.json';
import master from '~/static/master.json';

export function usePlantData() {
    const plants = useState<Plant[]>('plants', () => [])
    const families = useState<Plant[]>('families', () => [])
    const genera = useState<Plant[]>('genera', () => [])
    const species = useState<Plant[]>('species', () => [])
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

        // データを科・属・種に分割
        // 科
        families.value = plants.value.filter((plant) => plant.species === '' && plant.genus === '')
        // 属
        genera.value = plants.value.filter((plant) => plant.species === '' && plant.genus !== '')
        // 種
        species.value = plants.value.filter((plant) => plant.species !== '')

        isDataLoaded.value = true;
    }

    /**
     * 科を特徴でフィルタ
     * すべてのtrueキーを含んでいる
     * @param trueKeys 
     * @returns 
     */
    const filterFamilies = (
        trueKeys: string[]
    ): Plant[] => {
        return families.value.filter((plant) => {
            if (trueKeys.length === 0) return true;
            return trueKeys.every((key) => plant.characters.includes(key));
        });
    };

    /**
     * 属を特徴でフィルタ
     * すべてのtrueキーを含んでいる
     * @param trueKeys 
     * @returns 
     */
        const filterGenera = (
            trueKeys: string[]
        ): Plant[] => {
            return genera.value.filter((plant) => {
                if (trueKeys.length === 0) return true;
                return trueKeys.every((key) => plant.characters.includes(key));
            });
        };

    /**
     * 種を特徴でフィルタ
     * すべてのtrueキーを含んでいる
     * かつfalseキーを含んでいない
     * @param trueKeys 
     * @param falseKeys 
     * @returns 
     */
    const filterSpecies = (
        trueKeys: string[],
        falseKeys: string[]
    ): Plant[] => {
        return species.value.filter((plant) => {
            const hasAllTrueKeys =
                trueKeys.length === 0
                    ? true
                    : trueKeys.every((key) => plant.characters.includes(key));
            const hasNoFalseKeys = !falseKeys.some((key) =>
                plant.characters.includes(key)
            );
            return hasAllTrueKeys && hasNoFalseKeys;
        });
    };

    /**
     * 植物の分類群を取得
     * @param plant 
     * @returns {string} species, genus, family
     */
    const getTaxa = (plant: Plant): string => {
        if (plant.species !== '') {
            return 'species';
        } else if (plant.genus !== '') {
            return 'genus';
        } else {
            return 'family';
        }
    }

    return {
        plants: plants,
        characterSet: characterSet,
        categorySet: categorySet,
        loadPlantData,
        filterFamilies,
        filterGenera,
        filterSpecies,
        getTaxa
    };
}
