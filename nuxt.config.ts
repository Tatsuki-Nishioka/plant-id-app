// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  modules: ['@nuxt/eslint', '@nuxt/ui'],
  devtools: { enabled: true },

  app: {
    baseURL: '/plant-id-app/',
  },
  compatibilityDate: '2024-11-01',

  nitro: {
    output: {
      dir: 'docs', // GitHub Pagesのデフォルトディレクトリに合わせて出力ディレクトリを設定
    },
  },

  eslint: {
    config: {
      stylistic: true,
    },
  },
})
