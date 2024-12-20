// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  app: {
    baseURL: '/plant-id-app/'
  },

  nitro: {
    output: {
      dir: 'docs' // GitHub Pagesのデフォルトディレクトリに合わせて出力ディレクトリを設定
    }
  },

  modules: ['@nuxt/eslint']
})