// import { ref } from 'vue';
// import type { Plant, Family, CharacterSet, Character } from '~/types/plant';
// import plantsData from '~/static/plants-data.json';
// import characters from '~/static/characters.json';

// export function usePlantService() {
//     const plants = ref<Plant[]>([]);
//     const families = ref<Family[]>([]);
//     const characterSet = ref<CharacterSet>({});
//     const isDataLoaded = ref(false);

//     // データの読み込み
//     const loadPlantData = () => {
//         if (isDataLoaded.value) return;

//         const data = plantsData as any; // JSONデータの型をanyとして読み込む
//         const characterData = characters as Character[]; // JSONデータの型をanyとして読み込む
//         const tmpCharacterSet: CharacterSet = {};

//         // 特徴セットを読み込む
//         characterData.forEach(character => {
//             tmpCharacterSet[character.id] = character;
//         });
//         characterSet.value = tmpCharacterSet;

//         // 植物データを読み込む
//         if (data.plant_characters) {
//             families.value = data.plant_characters.map((family: any) => ({
//                 scientificName: family.scientificName,
//                 japaneseName: family.japaneseName || '',
//                 characters: family.characters,
//                 genera: family.genera.map((genus: any) => ({
//                     scientificName: genus.scientificName,
//                     japaneseName: genus.japaneseName,
//                     characters: genus.characters,
//                     species: genus.species.map((species: any) => ({
//                         scientificName: species.name,
//                         japaneseName: species.japaneseName,
//                         characters: species.characters,
//                     })),
//                 })),
//             }));
//             // 植物データをフラットにする
//             plants.value = families.value.reduce((acc: Plant[], family) => {
//                 acc.push({
//                     scientificName: family.scientificName,
//                     japaneseName: family.japaneseName,
//                     characters: family.characters,
//                 });
//                 family.genera.forEach(genus => {
//                     acc.push({
//                         scientificName: genus.scientificName,
//                         japaneseName: genus.japaneseName || null,
//                         characters: genus.characters,
//                     });
//                     genus.species.forEach(species => {
//                         acc.push({
//                             scientificName: species.scientificName,
//                             japaneseName: species.japaneseName || null,
//                             characters: species.characters,
//                         });
//                     });
//                 });
//                 return acc;
//             }, []);
//         }

//         isDataLoaded.value = true;
//     }

//     // 名前検索
//     const searchByName = (name: string): Plant[] => {
//         return plants.value.filter(plant => plant.scientificName.includes(name));
//     };

//     // 特徴検索
//     const searchByCharacters = (characters: number[]): Plant[] => {
//         return plants.value.filter(plant => characters.every(f => plant.characters.includes(f)));
//     };

//     onMounted(() => {
//         // データを読み込む
//         loadPlantData();
//     });

//     return {
//         plants: readonly(plants),
//         families: readonly(families),
//         characterSet: readonly(characterSet),
//         loadPlantData,
//         searchByName,
//         searchByCharacters,
//     };
// }

// export class PlantDatabase {
//     private families: Family[];
//     private characterSet: CharacterSet;

//     constructor(data: any) {
//         this.families = this.parseFamilies(data.plant_characters);
//     }

//     private parseFamilies(familiesData: any[]): Family[] {
//         return familiesData.map(family => ({
//             scientificName: family.scientificName,
//             japaneseName: family.japaneseName || '',
//             characters: family.characters as number[],
//             genera: family.genera.map((genus: any) => ({
//                 scientificName: genus.scientificName,
//                 japaneseName: genus.japaneseName,
//                 characters: genus.characters as number[],
//                 species: genus.species.map((species: any) => ({
//                     scientificName: species.name,
//                     japaneseName: species.japaneseName,
//                     characters: species.characters as number[],
//                 })),
//             })),
//         }));
//     }

//     /**
//      * 科のリストを取得
//      */
//     getFamilies(): Family[] {
//         return this.families;
//     }

//     /**
//      * 特定の科を取得
//      */
//     getFamilyByName(name: string): Family | undefined {
//         return this.families.find((family) => family.scientificName === name);
//     }

//     /**
//      * 特徴IDを名前に変換
//      */
//     getCharacterName(characterId: number): Character | undefined {
//         return this.characterSet[characterId];
//     }

//     /**
//      * 特定の特徴を持つ科・属・種を検索
//      */
//     findItemsByCharacter(characterId: number): { family: string; genus?: string; species?: string }[] {
//         const results: { family: string; genus?: string; species?: string }[] = [];

//         this.families.forEach((family) => {
//             if (family.characters.includes(characterId)) {
//                 results.push({ family: family.scientificName });
//             }
//             family.genera.forEach((genus) => {
//                 if (genus.characters.includes(characterId)) {
//                     results.push({ family: family.scientificName, genus: genus.scientificName });
//                 }
//                 genus.species.forEach((species) => {
//                     if (species.characters.includes(characterId)) {
//                         results.push({ family: family.scientificName, genus: genus.scientificName, species: species.scientificName });
//                     }
//                 });
//             });
//         });

//         return results;
//     }
// }