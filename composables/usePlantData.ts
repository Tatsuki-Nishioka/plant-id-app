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
     * 上位分類の植物を取得（属以上の分類）
     * @return {*}  {Plant[]}
     */
    const getHigherTaxa = (): Plant[] => {
        return plants.value.filter((plant) => plant.species === "");
    };

    /**
     * 下位分類の植物を取得（種以下）
     * @return {*}  {Plant[]}
     */
    const getLowerTaxa = (): Plant[] => {
        return plants.value.filter((plant) => plant.species !== "");
    };

    /**
     * 上位分類の植物
     * すべてのtrueキーを含んでいる
     * @param trueKeys 
     * @returns 
     */
    const filterHigherTaxa = (
        trueKeys: string[]
    ): Plant[] => {
        return getHigherTaxa().filter((plant) => {
            if (trueKeys.length === 0) return true;
            return trueKeys.every((key) => plant.characters.includes(key));
        });
    };

    /**
     * 下位分類の植物
     * すべてのtrueキーを含んでいる
     * かつfalseキーを含んでいない
     * @param trueKeys 
     * @param falseKeys 
     * @returns 
     */
    const filterLowerTaxa = (
        trueKeys: string[],
        falseKeys: string[]
    ): Plant[] => {
        return getLowerTaxa().filter((plant) => {
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
        getHigherTaxa,
        getLowerTaxa,
        filterHigherTaxa,
        filterLowerTaxa
    };
}
