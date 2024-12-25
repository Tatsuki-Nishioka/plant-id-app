import type { Plant, CharacterSet, Character, CategorySet, Category } from '~/types/plant';
import characters from '~/static/characters.json';
import categoryData from '~/static/categories.json';
import master from '~/static/master.json';

export function usePlantData() {
    const plants = useState<Plant[]>('plants', () => [])
    const characterSet = useState<CharacterSet>('characterSet', () => ({}))
    const categorySet = useState<CategorySet>('categorySet', () => ({}))
    const isDataLoaded = useState<boolean>('isDataLoaded', () => false)

    // 内部でのみ使用する変数をrefで定義
    const families = ref<Plant[]>([]);
    const genera = ref<Plant[]>([]);
    const species = ref<Plant[]>([]);

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
        plants.value = master.map((record) => {
            const japaneseName = record.japanese.startsWith('-') ? '' : record.japanese

            const plant= {} as Plant;
            plant.characters = record.characters
            plant.scientificName = record.scientificName
            if (record.species === '' && record.genus === '') { 
                plant.family = record.family
                plant.genus = ''
                plant.species = ''
                plant.familyJpn = japaneseName
                plant.genusJpn = ''
            } else if (record.species === '' && record.genus !== '') { 
                plant.family = record.family
                plant.genus = record.genus
                plant.species = ''
                plant.familyJpn = ''
                plant.genusJpn = japaneseName
            } else if (record.species !== '') { 
                plant.family = record.family
                plant.genus = record.genus
                plant.species = record.species
                plant.familyJpn = ''
                plant.genusJpn = ''
            }
            return plant;
        })
        // データを科・属・種に分割
        // 科
        families.value = plants.value.filter((plant) => plant.species === '' && plant.genus === '')
        // 属
        // 科の和名を補完
        genera.value = plants.value.filter((plant) => plant.species === '' && plant.genus !== '')
        for (const genus of genera.value) {
            genus.familyJpn = families.value.find((family) => family.family === genus.family)?.familyJpn ?? ''
        }
        // 種
        // 属・科の和名を補完
        species.value = plants.value.filter((plant) => plant.species !== '')
        for (const speciesIte of species.value) {
            speciesIte.familyJpn = families.value.find((family) => family.family === speciesIte.family)?.familyJpn ?? ''
            speciesIte.genusJpn = genera.value.find((genus) => genus.genus === speciesIte.genus)?.genusJpn ?? ''
        }

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

    return {
        plants: plants,
        characterSet: characterSet,
        categorySet: categorySet,
        loadPlantData,
        filterFamilies,
        filterGenera,
        filterSpecies,
    };
}
