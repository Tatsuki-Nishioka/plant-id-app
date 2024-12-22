/**
 * 植物情報
 */
export type Plant = {
    /**
     * 学名
     */
    scientificName: string;
    /**
     * 科
     */
    family: string;
    /**
     * 科_日本語
     */
    familyJpn: string;
    /**
     * 属
     */
    genus: string | null;
    /**
     * 属_日本語
     */
    genusJpn: string | null;
    /**
     * 種
     */
    species: string | null;
    /**
     * 特徴
     * character idの配列
     */
    characters: string[];
}

/**
 * 特徴
 */
export type Character = {
    /**
     * 特徴ID
     */
    id: string;
    /**
     * 特徴_英語
     */
    character: string;
    /**
     * 特徴_日本語
     */
    characterJpn: string;
    /**
     * 特徴詳細
     */
    characterDetail: string;
    /**
     * 特徴詳細_日本語
     */
    characterDetailJpn: string;
    /**
     * カテゴリID
     */
    categoryId: string;
}

/**
 * カテゴリ
 */
export type Category = {
    /**
     * カテゴリID
     */
    id: string;
    /**
     * カテゴリ_英語
     */
    category: string;
    /**
     * カテゴリ_日本語
     */
    categoryJpn: string;
    /**
     * カテゴリの説明_英語
     */
    detail: string;
    /**
     * カテゴリの説明_日本語
     */
    detailJpn: string;
}

/**
 * 特徴セット
 */
export type CharacterSet = {
    /**
     * 特徴IDをキーとした特徴のマップ
     */
    [key: string]: Character;
}

/**
 * カテゴリセット
 */
export type CategorySet = {
    /**
     * カテゴリIDをキーとしたカテゴリのマップ
     */
    [key: string]: Category;
}