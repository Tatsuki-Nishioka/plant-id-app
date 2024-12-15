/**
 * 植物の特徴を表すインターフェース
 * @export
 * @interface Plant
 */
export interface Plant {
    /**
     * 学名
     */
    scientificName: string;
    /**
     * 名前（日本語）
     */
    japaneseName: string | null;
    /**
     * 科
     */
    family: string;
    /**
     * 属
     */
    genus: string | null;
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

// /**
//  * 科の特徴を表すインターフェース
//  */
// export interface Family extends Plant {
//     /**
//      * 科の名前（日本語）
//      */
//     japaneseName: string;
//     /**
//      * 属の配列
//      */
//     genera: Genus[];
// }

// /**
//  * 属の特徴を表すインターフェース
//  */
// export interface Genus extends Plant {
//     /**
//      * 種の配列
//      */
//     species: Species[];
// }

// /**
//  * 種の特徴を表すインターフェース
//  */
// export interface Species extends Plant {
// }

/**
 * 植物の特徴を表すインターフェース
 */
export interface Character {
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
     * カテゴリ_英語
     */
    category: string
    /**
     * カテゴリ_日本語
     */;
    categoryJpn: string;
}

/**
 * 特徴セット
 */
export interface CharacterSet {
    /**
     * 特徴IDをキーとした特徴のマップ
     */
    [key: string]: Character;
}