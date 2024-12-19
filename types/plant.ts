/**
 * 植物情報
 */
export type Plant = {
  /**
     * 学名
     */
  scientificName: string
  /**
     * 名前（日本語）
     */
  japaneseName: string | null
  /**
     * 科
     */
  family: string
  /**
     * 属
     */
  genus: string | null
  /**
     * 種
     */
  species: string | null
  /**
     * 特徴
     * character idの配列
     */
  characters: string[]
}

/**
 * 特徴
 */
export type Character = {
  /**
     * 特徴ID
     */
  id: string
  /**
     * 特徴_英語
     */
  character: string
  /**
     * 特徴_日本語
     */
  characterJpn: string
  /**
     * カテゴリ_英語
     */
  category: string
  /**
     * カテゴリ_日本語
     */
  categoryJpn: string
}

/**
 * 特徴セット
 */
export type CharacterSet = {
  /**
     * 特徴IDをキーとした特徴のマップ
     */
  [key: string]: Character
}
