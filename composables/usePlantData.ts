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

    /**
     * 科を取得
     * @return {*}  {Plant[]}
     */
    const getFamilies = (): Plant[] => {
        return plants.value.filter((plant) => plant.species === "" && plant.genus === "");
    };

    /**
     * 属を取得
     * @return {*}  {Plant[]}
     */
    const getGenera = (): Plant[] => {
        return plants.value.filter((plant) => plant.species === "" && plant.genus !== "");
    }


    /**
     * 種を取得
     * @return {*}  {Plant[]}
     */
    const getSpecies = (): Plant[] => {
        return plants.value.filter((plant) => plant.species !== "");
    };

    /**
     * 科を特徴でフィルタ
     * すべてのtrueキーを含んでいる
     * @param trueKeys 
     * @returns 
     */
    const filterFamilies = (
        trueKeys: string[]
    ): Plant[] => {
        return getFamilies().filter((plant) => {
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
            return getGenera().filter((plant) => {
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
        return getSpecies().filter((plant) => {
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

    return {
        plants: plants,
        characterSet: characterSet,
        categorySet: categorySet,
        loadPlantData,
        getFamilies,
        getGenera,
        getSpecies,
        filterFamilies,
        filterGenera,
        filterSpecies,
    };
}
