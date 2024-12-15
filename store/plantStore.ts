import { defineStore } from 'pinia';
import type { Plant, Family, CharacterSet, Character } from '~/types/plant';
import plantsData from '~/static/plants-data.json';
import characters from '~/static/characters.json';

export const usePlantStore = defineStore('plantStore', {
  state: () => {
    // JSONデータの型をanyとして読み込む
    const data = plantsData as any;
    const characterData = characters as Character[];

    // 特徴セットを読み込む
    const characterSet = characterData.reduce((acc: CharacterSet, character: Character) => {
      acc[character.id] = character;
      return acc;
    }, {} as CharacterSet);

    // 植物データを読み込む
    const families = data.plant_characters ? data.plant_characters.map((family: any) => ({
      scientificName: family.scientificName,
      japaneseName: family.japaneseName || '',
      characters: family.characters,
      genera: family.genera.map((genus: any) => ({
        scientificName: genus.scientificName,
        japaneseName: genus.japaneseName,
        characters: genus.characters,
        species: genus.species.map((species: any) => ({
          scientificName: species.name,
          japaneseName: species.japaneseName,
          characters: species.characters,
        })),
      })),
    })) as Family[] : [] as Family[];

    // 植物データをフラットにする
    const plants = families.reduce((acc: Plant[], family: Family) => {
      acc.push({
        scientificName: family.scientificName,
        japaneseName: family.japaneseName,
        characters: family.characters,
      });
      family.genera.forEach(genus => {
        acc.push({
          scientificName: genus.scientificName,
          japaneseName: genus.japaneseName || null,
          characters: genus.characters,
        });
        genus.species.forEach(species => {
          acc.push({
            scientificName: species.scientificName,
            japaneseName: species.japaneseName || null,
            characters: species.characters,
          });
        });
      });
      return acc;
    }, []);

    return {
      plants,
      families,
      characterSet,
    };
  },
  actions: {
    searchByName(name: string): Plant[] {
      return this.plants.filter(plant => plant.scientificName.includes(name));
    },
    searchByFeatures(features: number[]): Plant[] {
      return this.plants.filter(plant => features.every(f => plant.characters.includes(f)));
    },
  },
});